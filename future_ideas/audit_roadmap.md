# Roadmap rozwoju funkcji audytu

## 1. Konfiguracja SMTP i środowiska
- Utwórz plik `.env` z danymi:
  - AUDIT_EMAIL_ENABLED=true
  - AUDIT_EMAIL_USER=twoj_email@gmail.com
  - AUDIT_EMAIL_PASS=app_password
- Przetestuj wysyłkę e-mail (np. lokalnie)

## 2. Integracja audytu z backendem
- Dodaj wywołania `logAudit()` do krytycznych endpointów (np. logowanie, modyfikacja danych, usuwanie plików)
- Przykład:
  - W endpointzie logowania: `logAudit('User login', { username: req.body.username });`

## 3. Rozszerzenie logiki audytu
- Dodaj typy operacji (np. „delete”, „update”, „access”)
- Loguj IP, user-agent, userId (jeśli dostępne)
- Dodaj opcję wyłączenia/włączenia audytu przez panel admina

## 4. Testy i monitoring
- Przetestuj logowanie i wysyłkę e-mail w różnych scenariuszach
- Dodaj alerty, jeśli e-mail nie może zostać wysłany

## 5. Dokumentacja
- Opisz w README jak działa audyt, jak go konfigurować i wyłączać
- Dodaj przykłady użycia

## 6. Bezpieczeństwo
- Zabezpiecz dane dostępowe do SMTP
- Upewnij się, że audyt nie loguje wrażliwych danych (np. haseł)

## 7. Rozwój
- Dodaj integrację z zewnętrznymi systemami SIEM/logowania
- Dodaj dashboard do przeglądania logów audytu
