# AI Development Environment

Aplikacja umożliwiająca generowanie kodu za pomocą AI (Google Gemini) z zabezpieczonym backendem (JWT) i obsługą wielu plików w formacie ZIP.

## Struktura projektu
- `frontend/`: Kod frontendu (React, HTML).
- `backend/`: Kod backendu (Node.js, Express).

## Wymagania
- Node.js (>= 18.x)
- Klucz API Google Gemini
- Konto GitHub

## Instalacja
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/your-username/ai-dev-environment.git
   ```
2. Przejdź do katalogu projektu:
   ```bash
   cd ai-dev-environment
   ```
3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj plik `.env.example` do `.env` i dostosuj według potrzeb:
     ```bash
     cp .env.example .env
     ```
4. Zainstaluj zależności:
   ```bash
   npm install
   ```
5. Uruchom backend:
   ```bash
   npm run start
   ```
6. Uruchom frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Użycie z Kubernetes

1. **Zastosuj manifesty z `infrastructure/kubernetes/`**:
   ```
   kubectl apply -f infrastructure/kubernetes/
   ```
2. **Skonfiguruj sekrety** używając wartości z pliku `.env`.

## Notatki

- Do produkcji używaj manifestów i sekretów Kubernetes.
- Lokalne środowisko można uruchomić używając `docker-compose` tylko dla DB/Redis.
