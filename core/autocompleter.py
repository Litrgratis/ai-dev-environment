#!/usr/bin/env python3
"""
Auto-completer: Wykrywanie i generowanie brakujących plików/projektów.
"""
import os
from typing import List

class AutoCompleter:
    def find_missing(self, root: str) -> List[str]:
        """
        Wykrywa brakujące pliki (README, testy, .env.example) w projekcie.
        """
        required = ["README.md", "tests/test_setup.py", "tools/.env.example"]
        missing = []
        for rel in required:
            if not os.path.exists(os.path.join(root, rel)):
                missing.append(rel)
        return missing

    def generate_file(self, rel_path: str):
        """
        Generuje szablon brakującego pliku.
        """
        content = "# Auto-generated file\n"
        with open(rel_path, "w") as f:
            f.write(content)

# Przykład użycia
if __name__ == "__main__":
    ac = AutoCompleter()
    print(ac.find_missing("."))
