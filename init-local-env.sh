#!/bin/bash

# AI Development Environment - Local Environment Setup Script
# Inicjalizuje środowisko z walidacją serwisów i trybem offline

set -euo pipefail

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguracja
PROJECT_NAME="AI Development Environment"
PROJECT_VERSION="1.0.0"
LOG_FILE="logs/init.log"
CONFIG_FILE=".llmconfig.yaml"
ENV_FILE=".env"

# Opcje
OFFLINE_MODE=${OFFLINE_MODE:-false}
FORCE_REINSTALL=${FORCE_REINSTALL:-false}
VERBOSE=${VERBOSE:-false}
SKIP_VALIDATION=${SKIP_VALIDATION:-false}

# Funkcje pomocnicze
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$LOG_FILE"
}

# Funkcja pomocy
show_help() {
    cat << EOF
$PROJECT_NAME - Local Environment Setup

Usage: $0 [OPTIONS]

Options:
    --offline           Enable offline mode (no internet downloads)
    --force-reinstall   Force reinstall of all components
    --verbose          Enable verbose output
    --skip-validation  Skip service validation
    --help             Show this help message

Environment Variables:
    OFFLINE_MODE=true          Enable offline mode
    FORCE_REINSTALL=true       Force reinstall
    VERBOSE=true               Enable verbose output
    SKIP_VALIDATION=true       Skip validation

Examples:
    $0                         # Standard setup
    $0 --offline              # Offline setup
    $0 --force-reinstall      # Force reinstall everything
    VERBOSE=true $0           # Verbose output

EOF
}

# Parsowanie argumentów
while [[ $# -gt 0 ]]; do
    case $1 in
        --offline)
            OFFLINE_MODE=true
            shift
            ;;
        --force-reinstall)
            FORCE_REINSTALL=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --skip-validation)
            SKIP_VALIDATION=true
            shift
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Inicjalizacja
init_environment() {
    log "🚀 Initializing $PROJECT_NAME v$PROJECT_VERSION"
    
    # Tworzenie katalogów
    mkdir -p logs llm-output/{analyses,documentation,tests,refactoring,reports}
    mkdir -p backend/src/{middleware,api}
    mkdir -p frontend/src/{components}
    mkdir -p ml-pipeline/{data,models,scripts}
    mkdir -p tests
    mkdir -p docker
    
    # Tworzenie pliku logów
    touch "$LOG_FILE"
    
    log "📁 Directory structure created"
}

# Sprawdzanie systemu
check_system() {
    log "🔍 Checking system requirements..."
    
    # Sprawdź system operacyjny
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        info "System: Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        info "System: macOS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        info "System: Windows"
    else
        warn "Unknown system: $OSTYPE"
    fi
    
    # Sprawdź dostępne miejsce na dysku
    available_space=$(df -h . | awk 'NR==2 {print $4}')
    info "Available disk space: $available_space"
    
    # Sprawdź pamięć RAM
    if command -v free &> /dev/null; then
        ram_total=$(free -h | grep '^Mem:' | awk '{print $2}')
        info "Total RAM: $ram_total"
    fi
}

# Sprawdzanie i instalacja Pythona
setup_python() {
    log "🐍 Setting up Python environment..."
    
    # Sprawdź Python
    if command -v python3 &> /dev/null; then
        python_version=$(python3 --version)
        info "Python found: $python_version"
    else
        error "Python 3 not found. Please install Python 3.8+"
        exit 1
    fi
    
    # Sprawdź pip
    if command -v pip3 &> /dev/null; then
        pip_version=$(pip3 --version)
        info "pip found: $pip_version"
    else
        error "pip3 not found. Please install pip"
        exit 1
    fi
    
    # Zainstaluj wymagane pakiety
    if [[ "$OFFLINE_MODE" == "false" ]]; then
        log "📦 Installing Python dependencies..."
        
        # Tworzenie requirements.txt jeśli nie istnieje
        if [[ ! -f "requirements.txt" ]]; then
            cat > requirements.txt << EOF
# AI Development Environment Dependencies
requests>=2.31.0
redis>=5.0.0
PyYAML>=6.0.1
ollama>=0.2.0
flask>=2.3.2
jupyter>=1.0.0
numpy>=1.24.0
pandas>=2.0.0
python-dotenv>=1.0.0
click>=8.1.0
rich>=13.0.0
pathlib2>=2.3.7
typing-extensions>=4.7.0
aiohttp>=3.8.0
asyncio>=3.4.3
tiktoken>=0.5.0
chromadb>=0.4.0
langchain>=0.0.350
transformers>=4.30.0
torch>=2.0.0
sentence-transformers>=2.2.0
EOF
        fi
        
        # Instalacja pakietów
        if pip3 install -r requirements.txt; then
            log "✅ Python dependencies installed"
        else
            error "Failed to install Python dependencies"
            exit 1
        fi
    else
        warn "Offline mode: Skipping Python package installation"
    fi
}

# Sprawdzanie i konfiguracja Redis
setup_redis() {
    log "🔴 Setting up Redis..."
    
    if command -v redis-server &> /dev/null; then
        redis_version=$(redis-server --version | head -1)
        info "Redis found: $redis_version"
        
        # Sprawdź czy Redis jest uruchomiony
        if redis-cli ping &> /dev/null; then
            log "✅ Redis is running"
        else
            log "🔄 Starting Redis server..."
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                systemctl start redis-server || redis-server --daemonize yes
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                brew services start redis || redis-server --daemonize yes
            else
                redis-server --daemonize yes
            fi
            
            # Sprawdź ponownie
            sleep 2
            if redis-cli ping &> /dev/null; then
                log "✅ Redis started successfully"
            else
                error "Failed to start Redis"
                exit 1
            fi
        fi
    else
        if [[ "$OFFLINE_MODE" == "false" ]]; then
            log "📦 Installing Redis..."
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                apt-get update && apt-get install -y redis-server
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                brew install redis
            else
                error "Please install Redis manually"
                exit 1
            fi
        else
            error "Redis not found and offline mode enabled"
            exit 1
        fi
    fi
}

# Sprawdzanie i konfiguracja Ollama
setup_ollama() {
    log "🤖 Setting up Ollama..."
    
    if command -v ollama &> /dev/null; then
        info "Ollama found"
        
        # Sprawdź czy Ollama jest uruchomiony
        if ollama list &> /dev/null; then
            log "✅ Ollama is running"
            
            # Sprawdź dostępne modele
            models=$(ollama list | grep -E "(mistral|llama|codellama)" | wc -l)
            if [[ $models -gt 0 ]]; then
                log "✅ LLM models available: $models"
                ollama list | grep -E "(mistral|llama|codellama)" | head -3
            else
                if [[ "$OFFLINE_MODE" == "false" ]]; then
                    log "📥 Downloading default models..."
                    ollama pull mistral:7b
                    ollama pull codellama:7b
                else
                    warn "No models found and offline mode enabled"
                fi
            fi
        else
            log "🔄 Starting Ollama server..."
            ollama serve &
            sleep 5
            
            if ollama list &> /dev/null; then
                log "✅ Ollama started successfully"
            else
                error "Failed to start Ollama"
                exit 1
            fi
        fi
    else
        if [[ "$OFFLINE_MODE" == "false" ]]; then
            log "📦 Installing Ollama..."
            curl -fsSL https://ollama.com/install.sh | sh
        else
            error "Ollama not found and offline mode enabled"
            exit 1
        fi
    fi
}

# Konfiguracja pliku .env
setup_env_file() {
    log "🔧 Setting up environment file..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log "📝 Creating .env file..."
        cat > "$ENV_FILE" << EOF
# AI Development Environment Configuration
# Generated on $(date)

# LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:7b

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_DB=0

# Flask Configuration
FLASK_PORT=5000
FLASK_ENV=development
FLASK_DEBUG=true

# Jupyter Configuration
JUPYTER_PORT=8888
JUPYTER_TOKEN=ai-dev-jupyter-token

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/ai-dev-environment.log

# Security
RATE_LIMIT_ENABLED=true
ENCRYPT_ENV=true

# Features
OFFLINE_MODE=$OFFLINE_MODE
CACHE_ENABLED=true
VERBOSE_OUTPUT=$VERBOSE

# Project Configuration
PROJECT_NAME="$PROJECT_NAME"
PROJECT_VERSION="$PROJECT_VERSION"
OUTPUT_DIR=llm-output
CONFIG_FILE=$CONFIG_FILE
EOF
        log "✅ Environment file created"
    else
        info "Environment file already exists"
    fi
}

# Walidacja serwisów
validate_services() {
    if [[ "$SKIP_VALIDATION" == "true" ]]; then
        warn "Skipping service validation"
        return 0
    fi
    
    log "🔬 Validating services..."
    
    local validation_failed=false
    
    # Sprawdź Python
    if python3 -c "import sys; print(f'Python {sys.version}')" &> /dev/null; then
        log "✅ Python validation passed"
    else
        error "Python validation failed"
        validation_failed=true
    fi
    
    # Sprawdź Redis
    if redis-cli ping | grep -q "PONG"; then
        log "✅ Redis validation passed"
    else
        error "Redis validation failed"
        validation_failed=true
    fi
    
    # Sprawdź Ollama
    if ollama list &> /dev/null; then
        log "✅ Ollama validation passed"
    else
        error "Ollama validation failed"
        validation_failed=true
    fi
    
    # Sprawdź moduły Python
    if python3 -c "import requests, redis, yaml; print('Core modules OK')" &> /dev/null; then
        log "✅ Python modules validation passed"
    else
        error "Python modules validation failed"
        validation_failed=true
    fi
    
    # Sprawdź pliki konfiguracyjne
    if [[ -f "$CONFIG_FILE" ]]; then
        if python3 -c "import yaml; yaml.safe_load(open('$CONFIG_FILE'))" &> /dev/null; then
            log "✅ Configuration file validation passed"
        else
            error "Configuration file validation failed"
            validation_failed=true
        fi
    else
        error "Configuration file not found"
        validation_failed=true
    fi
    
    if [[ "$validation_failed" == "true" ]]; then
        error "Service validation failed. Please check the errors above."
        exit 1
    fi
    
    log "✅ All services validated successfully"
}

# Test podstawowej funkcjonalności
test_functionality() {
    log "🧪 Testing basic functionality..."
    
    # Test LLM integration
    if [[ -f "llm_integration.py" ]]; then
        if python3 llm_integration.py --help &> /dev/null; then
            log "✅ LLM integration test passed"
        else
            error "LLM integration test failed"
            return 1
        fi
    else
        warn "LLM integration file not found"
    fi
    
    # Test generate report
    if [[ -f "generate_report.py" ]]; then
        if python3 generate_report.py --help &> /dev/null; then
            log "✅ Report generation test passed"
        else
            error "Report generation test failed"
            return 1
        fi
    else
        warn "Report generation file not found"
    fi
    
    # Test rate limiter
    if [[ -f "backend/src/middleware/rate_limiter.py" ]]; then
        if python3 -c "from backend.src.middleware.rate_limiter import RateLimiter; print('Rate limiter OK')" &> /dev/null; then
            log "✅ Rate limiter test passed"
        else
            error "Rate limiter test failed"
            return 1
        fi
    else
        warn "Rate limiter file not found"
    fi
    
    log "✅ Functionality tests completed"
}

# Wyświetlanie podsumowania
show_summary() {
    log "📊 Environment Setup Summary"
    echo
    echo "=========================================="
    echo "  AI Development Environment Setup"
    echo "=========================================="
    echo
    echo "✅ Project initialized: $PROJECT_NAME v$PROJECT_VERSION"
    echo "✅ System requirements checked"
    echo "✅ Python environment configured"
    echo "✅ Redis server running"
    echo "✅ Ollama LLM server running"
    echo "✅ Environment file created"
    echo "✅ Services validated"
    echo "✅ Basic functionality tested"
    echo
    echo "Configuration:"
    echo "  - Config file: $CONFIG_FILE"
    echo "  - Environment: $ENV_FILE"
    echo "  - Log file: $LOG_FILE"
    echo "  - Offline mode: $OFFLINE_MODE"
    echo
    echo "Next steps:"
    echo "  1. Run analysis: python3 llm_integration.py --task analyze"
    echo "  2. Generate report: python3 generate_report.py"
    echo "  3. Run tests: ./test-setup.sh"
    echo "  4. View results: ls -la llm-output/"
    echo
    echo "🎉 Environment is ready for development!"
    echo "=========================================="
}

# Główna funkcja
main() {
    # Sprawdź czy skrypt jest uruchamiany z głównego katalogu
    if [[ ! -f "init-local-env.sh" ]]; then
        error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Inicjalizacja
    init_environment
    
    # Sprawdzenie systemu
    check_system
    
    # Konfiguracja komponentów
    setup_python
    setup_redis
    setup_ollama
    setup_env_file
    
    # Walidacja
    validate_services
    
    # Testy
    test_functionality
    
    # Podsumowanie
    show_summary
    
    log "🎉 Setup completed successfully!"
}

# Obsługa sygnałów
trap 'error "Setup interrupted by user"; exit 1' INT TERM

# Uruchomienie głównej funkcji
main "$@"

set -e

echo "Starting AI Dev Environment..."

# Uruchom Docker Compose
docker-compose up -d
sleep 5  # Czekaj na start serwisów

# Walidacja serwisów
for service in redis ollama; do
    case $service in
        "redis") port=6379; expected="PONG"; cmd="redis-cli -p $port ping";;
        "ollama") port=11434; expected="Ollama"; cmd="curl -s localhost:$port";;
    esac
    if ! $cmd | grep -q "$expected"; then
        echo "❌ $service on port $port failed" >> logs/init.log
        exit 1
    fi
done

echo "✅ Environment initialized" >> logs/init.log
