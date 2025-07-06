"""
Executor: Uruchamianie wygenerowanego kodu w sandboxie (subprocess, Docker-ready).
"""
import subprocess
import tempfile
import os
from typing import Tuple

class Executor:
    def run_python(self, code: str, timeout: int = 10) -> Tuple[str, str, int]:
        """
        Uruchamia kod Python w sandboxie (tymczasowy plik, subprocess).
        Zwraca: (stdout, stderr, exit_code)
        """
        with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
            f.write(code)
            tmp_path = f.name
        try:
            result = subprocess.run([
                "python3", tmp_path
            ], capture_output=True, text=True, timeout=timeout)
            return result.stdout, result.stderr, result.returncode
        except Exception as e:
            return "", str(e), 1
        finally:
            os.remove(tmp_path)

# Przykład użycia
if __name__ == "__main__":
    executor = Executor()
    code = "print('Hello from sandbox!')\nraise Exception('Test error')"
    out, err, code = executor.run_python(code)
    print('STDOUT:', out)
    print('STDERR:', err)
    print('EXIT:', code)
