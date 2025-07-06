"""
CommandParser: Rozpoznawanie i przetwarzanie poleceń użytkownika.
"""

import re
from typing import Dict, Any

class CommandParser:
    def parse(self, command: str) -> Dict[str, Any]:
        """
        Parsuje polecenie tekstowe i zwraca strukturę zadania.
        Przykład wejścia: 'Stwórz model ML do klasyfikacji obrazów w PyTorch na CIFAR10.'
        """
        # Prosty parser oparty na regex (do rozbudowy o NLP)
        result = {
            "task": None,
            "type": None,
            "framework": None,
            "dataset": None,
            "output": None
        }
        if "model" in command and "klasyfikacji" in command:
            result["task"] = "create_ml_model"
            result["type"] = "image_classification"
        if "PyTorch".lower() in command.lower():
            result["framework"] = "pytorch"
        if "CIFAR10".lower() in command.lower():
            result["dataset"] = "cifar10"
        # Można dodać więcej reguł lub NLP
        result["output"] = "model_script.py"
        return result

# Przykład użycia
if __name__ == "__main__":
    parser = CommandParser()
    cmd = "Stwórz model ML do klasyfikacji obrazów w PyTorch na CIFAR10."
    print(parser.parse(cmd))
