"""
CodeAnalyzer: Analiza i generowanie kodu na podstawie poleceń.
"""

import re
import subprocess
from typing import Dict, Any, List

class CodeAnalyzer:
    def analyze(self, code: str) -> Dict[str, Any]:
        """
        Analizuje kod pod kątem składni, stylu i potencjalnych błędów.
        """
        result = {
            "syntax_ok": True,
            "style_ok": self.check_pep8_style(code),
            "issues": [],
            "imports": self.find_imports(code),
            "flake8": self.run_flake8(code),
            "pylint": self.run_pylint(code)
        }
        if 'import os' in code:
            result["issues"].append("Użycie import os – sprawdź bezpieczeństwo!")
        return result

    def check_pep8_style(self, code: str) -> bool:
        """
        Prosta kontrola stylu PEP8 (do rozbudowy o integrację z flake8/pylint).
        """
        # Przykład: sprawdź długość linii
        for line in code.splitlines():
            if len(line) > 79:
                return False
        return True

    def find_imports(self, code: str) -> List[str]:
        """
        Wyszukuje importowane moduły w kodzie.
        """
        imports = re.findall(r'^\s*import\s+(\w+)', code, re.MULTILINE)
        imports += re.findall(r'^\s*from\s+(\w+)', code, re.MULTILINE)
        return list(set(imports))

    def run_flake8(self, code: str) -> str:
        """
        Uruchamia flake8 na kodzie (wymaga zainstalowanego flake8).
        """
        try:
            with open("/tmp/_tmp_code.py", "w") as f:
                f.write(code)
            result = subprocess.run(["flake8", "/tmp/_tmp_code.py"], capture_output=True, text=True)
            return result.stdout.strip()
        except Exception as e:
            return f"flake8 error: {e}"

    def run_pylint(self, code: str) -> str:
        """
        Uruchamia pylint na kodzie (wymaga zainstalowanego pylint).
        """
        try:
            with open("/tmp/_tmp_code.py", "w") as f:
                f.write(code)
            result = subprocess.run(["pylint", "--disable=all", "--enable=errors", "/tmp/_tmp_code.py"], capture_output=True, text=True)
            return result.stdout.strip()
        except Exception as e:
            return f"pylint error: {e}"

    def generate_code(self, task: Dict[str, Any]) -> str:
        """
        Generuje kod na podstawie zadania (task).
        """
        # Przykład: generowanie szkieletu modelu ML
        if task.get("framework") == "pytorch":
            return "import torch\nimport torch.nn as nn\n\nclass Model(nn.Module):\n    def __init__(self):\n        super().__init__()\n        # ..."
        return "# TODO: implement code generation for task"

# Przykład użycia
if __name__ == "__main__":
    analyzer = CodeAnalyzer()
    code = "import os\nimport sys\nprint('Hello')\n" + ("a = 1\n" * 80)
    print(analyzer.analyze(code))
    print(analyzer.generate_code({"framework": "pytorch"}))
