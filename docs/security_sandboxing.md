# Sandboxowanie i Bezpieczeństwo LLM

## A. Sandbox dla generowanego kodu
- Docker: izolacja, limity CPU/RAM, brak sieci
- Firejail/gVisor: alternatywy

## B. Input Sanitization
- Filtracja niebezpiecznych poleceń
- Limit długości wejścia

## C. Ograniczenie uprawnień
- Użytkownik llm_user
- AppArmor/SELinux

## Przykłady implementacji
- backend/src/utils/sandbox.py
- backend/src/utils/input_sanitizer.py
- backend/src/utils/llm_permissions.sh
