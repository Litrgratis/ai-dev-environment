"""
Improver: Samodoskonalenie i optymalizacja kodu.
"""

from typing import Tuple

class Improver:
    def improve(self, code: str) -> str:
        """
        Proponuje ulepszenia kodu (np. optymalizacja, refaktoryzacja).
        Zwraca ulepszony kod (do rozbudowy o LLM i feedback loop).
        """
        # Przykład: zamiana pętli na list comprehension (do rozbudowy)
        if 'for' in code and 'append' in code:
            improved = code + "\n# Można zamienić pętlę na list comprehension."
            return improved
        return code

# Przykład użycia
if __name__ == "__main__":
    imp = Improver()
    code = "result = []\nfor x in range(10):\n    result.append(x*x)"
    print(imp.improve(code))
