"""
Debugger: Automatyczne wykrywanie i naprawa błędów w kodzie.
"""

from typing import List

class Debugger:
    def find_errors(self, code: str, logs: str = "") -> List[str]:
        """
        Analizuje kod i logi w poszukiwaniu błędów.
        """
        # Przykład: wykrywanie typowych błędów (do rozbudowy)
        errors = []
        if "SyntaxError" in logs:
            errors.append("Wykryto błąd składni.")
        if "NameError" in logs:
            errors.append("Niezdefiniowana zmienna.")
        return errors

    def suggest_fix(self, code: str, error: str) -> str:
        """
        Proponuje poprawkę na podstawie błędu.
        """
        # Przykład: prosta sugestia (do rozbudowy o LLM)
        if "Niezdefiniowana zmienna" in error:
            return "Sprawdź, czy wszystkie zmienne są zadeklarowane."
        return "Brak sugestii."

    def debug(self, code: str, errors) -> str:
        """
        Prosty debug: loguje błędy, zwraca kod do poprawy (do rozbudowy o LLM).
        """
        print("[DEBUG] Errors:", errors)
        # Można tu dodać automatyczne poprawki na podstawie błędów
        return code

# Przykład użycia
if __name__ == "__main__":
    dbg = Debugger()
    print(dbg.find_errors("print(x)", logs="NameError: name 'x' is not defined"))
    print(dbg.suggest_fix("print(x)", "Niezdefiniowana zmienna."))
