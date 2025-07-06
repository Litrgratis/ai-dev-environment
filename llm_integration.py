#!/usr/bin/env python3
"""
LLM Integration - AI Development Environment
Główny moduł do integracji z lokalnym modelem LLM (Ollama)
"""

import os
import sys
import argparse
import yaml
import json
import requests
import redis
import time
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import fnmatch
import hashlib
import tiktoken

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Importy lokalne
try:
    from backend.src.middleware.rate_limiter import RateLimiter, RateLimitExceeded
except ImportError:
    logger.warning("Rate limiter not available - continuing without rate limiting")
    RateLimiter = None
    RateLimitExceeded = Exception

class LLMIntegration:
    """
    Główna klasa integracji z LLM
    
    Funkcjonalności:
    - Analiza kodu z lokalnym modelem LLM
    - Generowanie dokumentacji
    - Tworzenie testów
    - Sugestie refaktoringu
    - Caching wyników
    - Rate limiting
    - Obsługa różnych formatów plików
    """
    
    def __init__(self, config_path: str = ".llmconfig.yaml"):
        self.config = self.load_config(config_path)
        self.project_root = Path.cwd()
        self.output_dir = Path(self.config.get('output', {}).get('directory', 'llm-output'))
        
        # Inicjalizacja komponentów
        self.setup_logging()
        self.setup_cache()
        self.setup_rate_limiter()
        self.setup_directories()
        
        # Konfiguracja LLM
        self.ollama_base_url = self.config.get('services', {}).get('ollama', {}).get('base_url', 'http://localhost:11434')
        self.default_model = self.config.get('models', {}).get('default', 'mistral:7b')
        
        # Tokenizer dla chunkowania
        try:
            self.tokenizer = tiktoken.get_encoding("cl100k_base")
        except Exception as e:
            logger.warning(f"Could not load tokenizer: {e}")
            self.tokenizer = None
    
    def load_config(self, config_path: str) -> Dict[str, Any]:
        """Ładuje konfigurację z pliku YAML"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                logger.info(f"✅ Loaded config from {config_path}")
                return config
        except Exception as e:
            logger.warning(f"❌ Could not load config from {config_path}: {e}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Zwraca domyślną konfigurację"""
        return {
            'project': {'name': 'AI Development Environment', 'version': '1.0.0'},
            'models': {'default': 'mistral:7b'},
            'services': {'ollama': {'base_url': 'http://localhost:11434'}},
            'tasks': {
                'analyze': {'model': 'mistral:7b', 'chunk_size': 2000},
                'document': {'model': 'mistral:7b', 'chunk_size': 1500},
                'test': {'model': 'mistral:7b', 'chunk_size': 1000},
                'refactor': {'model': 'mistral:7b', 'chunk_size': 1500}
            },
            'cache': {'enabled': True, 'ttl': 3600},
            'output': {'directory': 'llm-output'}
        }
    
    def setup_logging(self):
        """Konfiguruje logowanie"""
        log_config = self.config.get('logging', {})
        log_level = log_config.get('level', 'INFO')
        
        logging.getLogger().setLevel(getattr(logging, log_level))
        
        # Dodaj file handler jeśli skonfigurowany
        if 'file' in log_config:
            log_file = log_config['file']
            os.makedirs(os.path.dirname(log_file), exist_ok=True)
            
            file_handler = logging.FileHandler(log_file)
            formatter = logging.Formatter(log_config.get('format', '%(asctime)s - %(levelname)s - %(message)s'))
            file_handler.setFormatter(formatter)
            logging.getLogger().addHandler(file_handler)
    
    def setup_cache(self):
        """Inicjalizuje cache (Redis)"""
        cache_config = self.config.get('cache', {})
        
        if not cache_config.get('enabled', True):
            self.cache = None
            return
        
        try:
            redis_url = self.config.get('services', {}).get('redis', {}).get('url', 'redis://localhost:6379')
            self.cache = redis.from_url(redis_url)
            self.cache.ping()
            self.cache_ttl = cache_config.get('ttl', 3600)
            logger.info("✅ Cache (Redis) initialized")
        except Exception as e:
            logger.warning(f"❌ Cache not available: {e}")
            self.cache = None
    
    def setup_rate_limiter(self):
        """Inicjalizuje rate limiter"""
        if RateLimiter is None:
            self.rate_limiter = None
            return
        
        try:
            self.rate_limiter = RateLimiter()
            logger.info("✅ Rate limiter initialized")
        except Exception as e:
            logger.warning(f"❌ Rate limiter not available: {e}")
            self.rate_limiter = None
    
    def setup_directories(self):
        """Tworzy niezbędne katalogi"""
        dirs_to_create = [
            self.output_dir,
            self.output_dir / 'analyses',
            self.output_dir / 'documentation',
            self.output_dir / 'tests',
            self.output_dir / 'refactoring',
            self.output_dir / 'reports',
            Path('logs')
        ]
        
        for dir_path in dirs_to_create:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        logger.info(f"✅ Output directories created in {self.output_dir}")
    
    def read_llmignore(self) -> List[str]:
        """Czyta plik .llmignore"""
        ignore_patterns = []
        # Ensure project_root is a Path object
        project_root = Path(self.project_root) if isinstance(self.project_root, str) else self.project_root
        llmignore_path = project_root / '.llmignore'
        
        if llmignore_path.exists():
            try:
                with open(llmignore_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            ignore_patterns.append(line)
                logger.info(f"✅ Loaded {len(ignore_patterns)} ignore patterns")
            except Exception as e:
                logger.warning(f"❌ Could not read .llmignore: {e}")
        
        return ignore_patterns
    
    def should_ignore_file(self, file_path: Path, ignore_patterns: List[str]) -> bool:
        """Sprawdza czy plik powinien być zignorowany"""
        project_root = Path(self.project_root) if isinstance(self.project_root, str) else self.project_root
        file_str = str(file_path.relative_to(project_root))
        
        for pattern in ignore_patterns:
            if fnmatch.fnmatch(file_str, pattern) or fnmatch.fnmatch(file_path.name, pattern):
                return True
        
        return False
    
    def get_file_type(self, file_path: str) -> str:
        """Określa typ pliku na podstawie rozszerzenia"""
        extension = Path(file_path).suffix.lower()
        
        type_mapping = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.jsx': 'javascript',
            '.tsx': 'typescript',
            '.java': 'java',
            '.cpp': 'cpp',
            '.c': 'c',
            '.h': 'c',
            '.hpp': 'cpp',
            '.rs': 'rust',
            '.go': 'go',
            '.rb': 'ruby',
            '.php': 'php',
            '.sql': 'sql',
            '.yaml': 'yaml',
            '.yml': 'yaml',
            '.json': 'json',
            '.xml': 'xml',
            '.md': 'markdown',
            '.sh': 'bash',
            '.bash': 'bash',
        }
        
        return type_mapping.get(extension, 'text')
    
    def get_project_files(self) -> List[str]:
        """Pobiera listę plików projektu do analizy"""
        ignore_patterns = self.read_llmignore()
        files = []
        
        # Ensure project_root is a Path object
        project_root = Path(self.project_root) if isinstance(self.project_root, str) else self.project_root
        
        # Dozwolone rozszerzenia
        allowed_extensions = self.config.get('security', {}).get('allowed_extensions', [
            '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.h', '.hpp',
            '.rs', '.go', '.rb', '.php', '.sql', '.yaml', '.yml', '.json', '.xml',
            '.md', '.txt', '.sh', '.bash'
        ])
        
        for file_path in project_root.rglob('*'):
            if file_path.is_file():
                # Sprawdź rozszerzenie
                if file_path.suffix.lower() not in allowed_extensions:
                    continue
                
                # Sprawdź ignore patterns
                if self.should_ignore_file(file_path, ignore_patterns):
                    continue
                
                # Sprawdź rozmiar pliku (pomiń zbyt duże pliki)
                if file_path.stat().st_size > 1024 * 1024:  # 1MB
                    continue
                
                files.append(str(file_path))
        
        logger.info(f"✅ Found {len(files)} files for analysis")
        return files
    
    def chunk_text(self, text: str, chunk_size: int = 2000) -> list:
        """Dzieli tekst na chunk_size tokenów (tiktoken, cl100k_base)"""
        if not text:
            return [text]
        try:
            import tiktoken
            encoder = tiktoken.get_encoding("cl100k_base")
            tokens = encoder.encode(text)
            chunks, current_tokens = [], []
            for token in tokens:
                current_tokens.append(token)
                if len(current_tokens) >= chunk_size:
                    chunks.append(encoder.decode(current_tokens))
                    current_tokens = []
            if current_tokens:
                chunks.append(encoder.decode(current_tokens))
            return chunks if chunks else [text]
        except Exception as e:
            # fallback: single chunk
            return [text]
    
    def get_cache_key(self, content: str, task: str, model: str) -> str:
        """Generuje klucz cache"""
        content_hash = hashlib.md5(content.encode()).hexdigest()
        return f"llm:{task}:{model}:{content_hash}"
    
    def get_from_cache(self, cache_key: str) -> Optional[str]:
        """Pobiera wynik z cache"""
        if not self.cache:
            return None
        
        try:
            result = self.cache.get(cache_key)
            if result:
                logger.debug(f"✅ Cache hit for {cache_key}")
                return result.decode('utf-8')
        except Exception as e:
            logger.warning(f"❌ Cache read error: {e}")
        
        return None
    
    def save_to_cache(self, cache_key: str, content: str) -> None:
        """Zapisuje wynik do cache"""
        if not self.cache:
            return
        
        try:
            self.cache.setex(cache_key, self.cache_ttl, content)
            logger.debug(f"✅ Saved to cache: {cache_key}")
        except Exception as e:
            logger.warning(f"❌ Cache write error: {e}")
    
    def get_prompt_for_file(self, file_path: str, task: str, content: str) -> str:
        """Generuje prompt dla zadania"""
        file_type = self.get_file_type(file_path)
        
        # Pobierz template z konfiguracji
        prompts = self.config.get('prompts', {})
        task_prompt = prompts.get(task, {})
        
        if not task_prompt:
            # Domyślny prompt
            return f"""Please {task} this {file_type} code:

File: {file_path}

```{file_type}
{content}
```

Provide detailed analysis and recommendations."""
        
        # Użyj template z konfiguracji
        system_prompt = task_prompt.get('system', '')
        user_prompt = task_prompt.get('user', '')
        
        # Podstaw zmienne
        user_prompt = user_prompt.format(
            file_type=file_type,
            file_path=file_path,
            code=content
        )
        
        return f"{system_prompt}\n\n{user_prompt}"
    
    def call_ollama(self, prompt: str, model: str = None) -> Optional[str]:
        """Wykonuje zapytanie do Ollama"""
        if model is None:
            model = self.default_model
        
        # Sprawdź rate limiting
        if self.rate_limiter:
            try:
                result = self.rate_limiter.check_rate_limit('localhost', 'llm_analyze')
                if not result['allowed']:
                    logger.warning("Rate limit exceeded")
                    return None
            except Exception as e:
                logger.warning(f"Rate limiter error: {e}")
        
        # Przygotuj zapytanie
        url = f"{self.ollama_base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            logger.debug(f"🔄 Calling Ollama with model {model}")
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '')
            else:
                logger.error(f"❌ Ollama API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Ollama call failed: {e}")
            return None
    
    def call_llm(self, prompt: str, task: str, model: str = None) -> Optional[str]:
        """Wywołuje LLM z cache"""
        if model is None:
            model = self.default_model
        
        # Sprawdź cache
        cache_key = self.get_cache_key(prompt, task, model)
        cached_result = self.get_from_cache(cache_key)
        
        if cached_result:
            return cached_result
        
        # Wywołaj LLM
        result = self.call_ollama(prompt, model)
        
        # Zapisz do cache
        if result:
            self.save_to_cache(cache_key, result)
        
        return result
    
    def analyze_file(self, file_path: str, task: str = 'analyze') -> Optional[Dict[str, Any]]:
        """Analizuje pojedynczy plik"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            logger.error(f"❌ Could not read file {file_path}: {e}")
            return None
        
        if not content.strip():
            logger.warning(f"⚠️ File {file_path} is empty")
            return None
        
        # Podziel na części jeśli plik jest duży
        task_config = self.config.get('tasks', {}).get(task, {})
        chunk_size = task_config.get('chunk_size', 2000)
        chunks = self.chunk_text(content, chunk_size)
        
        results = []
        
        for i, chunk in enumerate(chunks):
            logger.info(f"🔄 Analyzing {file_path} chunk {i+1}/{len(chunks)}")
            
            prompt = self.get_prompt_for_file(file_path, task, chunk)
            result = self.call_llm(prompt, task, task_config.get('model'))
            
            if result:
                results.append({
                    'chunk_index': i,
                    'chunk_size': len(chunk),
                    'result': result
                })
            else:
                logger.warning(f"❌ No result for chunk {i+1} of {file_path}")
        
        if not results:
            return None
        
        # Przygotuj metadane
        file_type = self.get_file_type(file_path)
        
        return {
            'file_path': file_path,
            'file_type': file_type,
            'task': task,
            'model': task_config.get('model', self.default_model),
            'timestamp': datetime.now().isoformat(),
            'chunks_count': len(chunks),
            'results': results,
            'total_size': len(content),
            'lines_count': content.count('\n') + 1
        }
    
    def save_analysis_result(self, result: Dict[str, Any]) -> str:
        """Zapisuje wynik analizy do pliku"""
        file_path = result['file_path']
        task = result['task']
        
        # Przygotuj nazwę pliku output
        file_name = Path(file_path).name
        safe_name = "".join(c for c in file_name if c.isalnum() or c in ('-', '_', '.'))
        output_filename = f"{safe_name}_{task}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        
        # Wybierz katalog na podstawie zadania
        output_subdir = self.output_dir / task.replace('analyze', 'analyses')
        output_subdir.mkdir(exist_ok=True)
        
        output_path = output_subdir / output_filename
        
        # Przygotuj zawartość Markdown
        content = f"""---
title: "{task.title()} - {file_name}"
file_path: "{file_path}"
file_type: "{result['file_type']}"
task: "{task}"
model: "{result['model']}"
timestamp: "{result['timestamp']}"
chunks_count: {result['chunks_count']}
total_size: {result['total_size']}
lines_count: {result['lines_count']}
---

# {task.title()} Results - {file_name}

**File:** `{file_path}`  
**Type:** {result['file_type']}  
**Task:** {task}  
**Model:** {result['model']}  
**Generated:** {result['timestamp']}  

## Analysis Results

"""
        
        # Dodaj wyniki każdego chunka
        for chunk_result in result['results']:
            if len(result['results']) > 1:
                content += f"### Chunk {chunk_result['chunk_index'] + 1}\n\n"
            
            content += chunk_result['result']
            content += "\n\n"
        
        # Dodaj metadane na końcu
        content += f"""---

## Metadata

- **File Size:** {result['total_size']:,} bytes
- **Lines:** {result['lines_count']:,}
- **Chunks:** {result['chunks_count']}
- **Generated by:** AI Development Environment
- **Model:** {result['model']}

"""
        
        # Zapisz plik
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            logger.info(f"✅ Analysis saved to {output_path}")
            return str(output_path)
        except Exception as e:
            logger.error(f"❌ Could not save analysis to {output_path}: {e}")
            return None
    
    def run_analysis(self, task: str = 'analyze', max_files: int = None, 
                    file_pattern: str = None, dry_run: bool = False) -> List[str]:
        """Uruchamia analizę na wybranych plikach"""
        logger.info(f"🚀 Starting {task} analysis")
        
        # Pobierz listę plików
        files = self.get_project_files()
        
        # Filtruj po wzorcu jeśli podano
        if file_pattern:
            files = [f for f in files if fnmatch.fnmatch(f, file_pattern)]
        
        # Ogranicz liczbę plików
        if max_files:
            files = files[:max_files]
        
        logger.info(f"📋 Will analyze {len(files)} files")
        
        if dry_run:
            logger.info("🧪 Dry run mode - no actual analysis will be performed")
            for file_path in files:
                logger.info(f"   Would analyze: {file_path}")
            return []
        
        # Analizuj pliki
        results = []
        
        for i, file_path in enumerate(files):
            logger.info(f"🔄 Processing file {i+1}/{len(files)}: {file_path}")
            
            try:
                result = self.analyze_file(file_path, task)
                if result:
                    output_path = self.save_analysis_result(result)
                    if output_path:
                        results.append(output_path)
                else:
                    logger.warning(f"❌ No result for {file_path}")
            except Exception as e:
                logger.error(f"❌ Error analyzing {file_path}: {e}")
        
        logger.info(f"✅ Analysis completed. Generated {len(results)} files.")
        return results
    
    def main(self):
        """Główna funkcja CLI"""
        parser = argparse.ArgumentParser(description="AI Development Environment - LLM Integration")
        parser.add_argument('--task', choices=['analyze', 'document', 'test', 'refactor'],
                          default='analyze', help='Task to perform')
        parser.add_argument('--model', help='LLM model to use')
        parser.add_argument('--max-files', type=int, help='Maximum number of files to process')
        parser.add_argument('--pattern', help='File pattern to match')
        parser.add_argument('--output', help='Output directory')
        parser.add_argument('--dry-run', action='store_true', help='Show what would be done without doing it')
        parser.add_argument('--silent', action='store_true', help='Reduce output')
        parser.add_argument('--verbose', action='store_true', help='Verbose output')
        parser.add_argument('--config', default='.llmconfig.yaml', help='Configuration file')
        
        args = parser.parse_args()
        
        # Konfiguruj logowanie
        if args.silent:
            logging.getLogger().setLevel(logging.ERROR)
        elif args.verbose:
            logging.getLogger().setLevel(logging.DEBUG)
        
        try:
            # Utwórz instancję
            llm = LLMIntegration(args.config)
            
            # Ustaw model jeśli podano
            if args.model:
                llm.default_model = args.model
            
            # Ustaw output directory jeśli podano
            if args.output:
                llm.output_dir = Path(args.output)
                llm.setup_directories()
            
            # Uruchom analizę
            results = llm.run_analysis(
                task=args.task,
                max_files=args.max_files,
                file_pattern=args.pattern,
                dry_run=args.dry_run
            )
            
            # Podsumowanie
            if not args.silent:
                print(f"\n🎉 {args.task.title()} completed!")
                print(f"   Files processed: {len(results)}")
                print(f"   Results saved to: {llm.output_dir}")
                print(f"   Next step: python3 generate_report.py")
            
        except KeyboardInterrupt:
            logger.info("❌ Analysis interrupted by user")
            sys.exit(1)
        except Exception as e:
            logger.error(f"❌ Error during analysis: {e}")
            if args.verbose:
                import traceback
                traceback.print_exc()
            sys.exit(1)

if __name__ == "__main__":
    llm = LLMIntegration()
    llm.main()
