"""
VCS: Integracja z systemem kontroli wersji (git).
"""
import subprocess
from typing import Optional

class VCS:
    def commit(self, message: str) -> bool:
        try:
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", message], check=True)
            return True
        except Exception as e:
            print(f"VCS commit error: {e}")
            return False

    def create_branch(self, name: str) -> bool:
        try:
            subprocess.run(["git", "checkout", "-b", name], check=True)
            return True
        except Exception as e:
            print(f"VCS branch error: {e}")
            return False

    def get_log(self, n: int = 5) -> Optional[str]:
        try:
            result = subprocess.run(["git", "log", f"-{n}"], capture_output=True, text=True)
            return result.stdout
        except Exception as e:
            print(f"VCS log error: {e}")
            return None

# Przykład użycia
if __name__ == "__main__":
    vcs = VCS()
    print(vcs.get_log())
