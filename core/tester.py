"""
Tester: Automatyczne generowanie i uruchamianie testów jednostkowych.
"""

import ast
from typing import List
import pytest
import os
from pathlib import Path
import subprocess
import json

class Tester:
    def __init__(self):
        self.test_dir = Path("tests/generated")
        self.test_dir.mkdir(parents=True, exist_ok=True)

    def generate_tests(self, code: str) -> str:
        """
        Generuje szkielet testów jednostkowych dla funkcji z kodu źródłowego.
        """
        tree = ast.parse(code)
        test_code = "import pytest\n\n"
        for node in tree.body:
            if isinstance(node, ast.FunctionDef):
                test_code += f"def test_{node.name}():\n    # TODO: implement test for {node.name}\n    assert True\n\n"
        return test_code

    def generate_test(self, code, output_file):
        test_code = f"""
import pytest
{code}

def test_model():
    assert True  # Placeholder, zastąp konkretnymi testami
"""
        test_file = self.test_dir / output_file
        with open(test_file, "w") as f:
            f.write(test_code)
        return test_file

    def run_tests(self, code):
        test_file = self.generate_test(code, "test_model.py")
        result = subprocess.run(
            ["pytest", str(test_file), "--cov", "--cov-report=html"],
            capture_output=True,
            text=True
        )
        return {
            "passed": result.returncode == 0,
            "output": result.stdout,
            "errors": result.stderr,
            "coverage_report": self._generate_coverage_report()
        }

    def _generate_coverage_report(self):
        coverage_file = Path("htmlcov/index.html")
        if coverage_file.exists():
            with open(coverage_file, "r") as f:
                return f.read()
        return "No coverage report generated"

    def run_static_analysis(self, code_file):
        flake8_result = subprocess.run(
            ["flake8", str(code_file)],
            capture_output=True,
            text=True
        )
        pylint_result = subprocess.run(
            ["pylint", str(code_file), "--output-format=json"],
            capture_output=True,
            text=True
        )
        try:
            pylint_json = json.loads(pylint_result.stdout)
        except json.JSONDecodeError:
            pylint_json = []
        return {
            "flake8": flake8_result.stdout,
            "pylint": pylint_json
        }

# Przykład użycia
if __name__ == "__main__":
    tester = Tester()
    code = """def add(a, b):\n    return a + b\n"""
    print(tester.generate_tests(code))
