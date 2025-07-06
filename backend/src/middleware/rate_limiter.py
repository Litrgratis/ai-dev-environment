"""
Rate Limiter dla AI Development Environment
Implementuje ograniczenia żądań dla bezpieczeństwa i stabilności
"""

import time
import redis
from typing import Dict, Optional, Any
from dataclasses import dataclass
from functools import wraps
import logging

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class RateLimitConfig:
    """Konfiguracja limitów żądań"""
    max_requests: int = 100
    window_seconds: int = 3600  # 1 godzina
    block_duration: int = 7200  # 2 godziny blokady
    
class RateLimiter:
    """
    Rate Limiter z użyciem Redis
    
    Funcjonalności:
    - Ograniczanie żądań na podstawie IP/user_id
    - Automatyczne blokowanie przy przekroczeniu limitu
    - Różne limity dla różnych endpointów
    - Whitelist dla zaufanych adresów
    """
    
    def __init__(self, redis_client: Optional[redis.Redis] = None, 
                 redis_url: str = "redis://localhost:6379"):
        try:
            self.redis_client = redis_client or redis.from_url(redis_url)
            self.redis_client.ping()
            logger.info("✅ Redis connection established for rate limiting")
        except Exception as e:
            logger.warning(f"❌ Redis not available: {e}")
            self.redis_client = None
            
        # Domyślne konfiguracje dla różnych endpointów
        self.configs = {
            'default': RateLimitConfig(100, 3600),
            'llm_analyze': RateLimitConfig(50, 3600),
            'llm_generate': RateLimitConfig(30, 3600),
            'upload': RateLimitConfig(20, 3600),
            'auth': RateLimitConfig(10, 900),  # 15 minut
        }
        
        # Whitelist IP (localhost, trusted networks)
        self.whitelist = {'127.0.0.1', '::1', '0.0.0.0'}
    
    def add_to_whitelist(self, ip: str) -> None:
        """Dodaje IP do whitelist"""
        self.whitelist.add(ip)
        logger.info(f"Added {ip} to rate limiter whitelist")
    
    def is_whitelisted(self, identifier: str) -> bool:
        """Sprawdza czy IP jest na whitelist"""
        return identifier in self.whitelist
    
    def get_key(self, identifier: str, endpoint: str) -> str:
        """Generuje klucz Redis dla rate limitingu"""
        return f"rate_limit:{endpoint}:{identifier}"
    
    def check_rate_limit(self, identifier: str, endpoint: str = 'default') -> Dict[str, Any]:
        """
        Sprawdza limit żądań
        
        Returns:
            Dict z informacjami o limicie:
            - allowed: bool (czy żądanie jest dozwolone)
            - remaining: int (pozostałe żądania)
            - reset_time: float (czas resetu limitu)
            - blocked_until: Optional[float] (czas końca blokady)
        """
        
        # Sprawdz whitelist
        if self.is_whitelisted(identifier):
            return {
                'allowed': True,
                'remaining': 999,
                'reset_time': time.time() + 3600,
                'blocked_until': None
            }
        
        # Jeśli Redis niedostępny, pozwól (fail-open)
        if not self.redis_client:
            logger.warning("Redis unavailable, allowing request (fail-open)")
            return {
                'allowed': True,
                'remaining': 999,
                'reset_time': time.time() + 3600,
                'blocked_until': None
            }
        
        config = self.configs.get(endpoint, self.configs['default'])
        key = self.get_key(identifier, endpoint)
        block_key = f"{key}:blocked"
        
        current_time = time.time()
        
        try:
            # Sprawdź czy jest zablokowany
            blocked_until = self.redis_client.get(block_key)
            if blocked_until and float(blocked_until) > current_time:
                return {
                    'allowed': False,
                    'remaining': 0,
                    'reset_time': current_time + config.window_seconds,
                    'blocked_until': float(blocked_until)
                }
            
            # Usuń blokadę jeśli wygasła
            if blocked_until:
                self.redis_client.delete(block_key)
            
            # Pobierz aktualne żądania
            pipe = self.redis_client.pipeline()
            pipe.multi()
            
            # Sliding window counter
            pipe.zremrangebyscore(key, 0, current_time - config.window_seconds)
            pipe.zcard(key)
            pipe.zadd(key, {str(current_time): current_time})
            pipe.expire(key, config.window_seconds)
            
            results = pipe.execute()
            current_requests = results[1]
            
            # Sprawdź limit
            if current_requests >= config.max_requests:
                # Ustaw blokadę
                block_until = current_time + config.block_duration
                self.redis_client.setex(block_key, config.block_duration, str(block_until))
                
                logger.warning(f"Rate limit exceeded for {identifier} on {endpoint}. "
                             f"Requests: {current_requests}/{config.max_requests}. "
                             f"Blocked until: {block_until}")
                
                return {
                    'allowed': False,
                    'remaining': 0,
                    'reset_time': current_time + config.window_seconds,
                    'blocked_until': block_until
                }
            
            return {
                'allowed': True,
                'remaining': config.max_requests - current_requests - 1,
                'reset_time': current_time + config.window_seconds,
                'blocked_until': None
            }
            
        except Exception as e:
            logger.error(f"Rate limiter error: {e}")
            # Fail-open w przypadku błędu
            return {
                'allowed': True,
                'remaining': 999,
                'reset_time': current_time + config.window_seconds,
                'blocked_until': None
            }
    
    def decorator(self, endpoint: str = 'default'):
        """
        Dekorator do używania z funkcjami
        
        Usage:
            @rate_limiter.decorator('llm_analyze')
            def analyze_code(user_id):
                # function code
        """
        def decorator_wrapper(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Próbuj wyciągnąć identifier z argumentów
                identifier = kwargs.get('user_id') or kwargs.get('ip') or '127.0.0.1'
                
                result = self.check_rate_limit(identifier, endpoint)
                
                if not result['allowed']:
                    raise RateLimitExceeded(
                        f"Rate limit exceeded for {endpoint}. "
                        f"Try again at {result['reset_time']}"
                    )
                
                return func(*args, **kwargs)
            return wrapper
        return decorator_wrapper

class RateLimitExceeded(Exception):
    """Wyjątek rzucany przy przekroczeniu limitu"""
    pass

# Instancja globalna
rate_limiter = RateLimiter()

def get_rate_limiter() -> RateLimiter:
    """Pobiera globalną instancję rate limitera"""
    return rate_limiter

# Przykład użycia
if __name__ == "__main__":
    # Test rate limitera
    limiter = RateLimiter()
    
    # Dodaj do whitelist
    limiter.add_to_whitelist("192.168.1.100")
    
    # Test sprawdzania limitu
    for i in range(5):
        result = limiter.check_rate_limit("test_user", "llm_analyze")
        print(f"Request {i+1}: {result}")
        time.sleep(0.1)
    
    print("✅ Rate limiter test completed")
