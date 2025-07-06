"""
FileAPI: Granularna edycja i modyfikacja plików projektu.
"""
import os
from typing import Optional

class FileAPI:
    def read(self, path: str) -> Optional[str]:
        try:
            with open(path, "r") as f:
                return f.read()
        except Exception as e:
            print(f"FileAPI read error: {e}")
            return None

    def write(self, path: str, content: str) -> bool:
        try:
            with open(path, "w") as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"FileAPI write error: {e}")
            return False

    def append(self, path: str, content: str) -> bool:
        try:
            with open(path, "a") as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"FileAPI append error: {e}")
            return False

# Przykład użycia
if __name__ == "__main__":
    api = FileAPI()
    api.write("test.txt", "Hello!")
    print(api.read("test.txt"))
