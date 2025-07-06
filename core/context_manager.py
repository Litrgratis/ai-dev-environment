"""
ContextManager: Zarządzanie kontekstem i historią interakcji dla LLM.
"""
import json
from typing import List, Dict

class ContextManager:
    def __init__(self, history_file: str = "llm_context.json"):
        self.history_file = history_file
        self.history: List[Dict] = []
        self.load()

    def add_entry(self, entry: Dict):
        self.history.append(entry)
        self.save()

    def get_context(self, n: int = 10) -> List[Dict]:
        return self.history[-n:]

    def save(self):
        with open(self.history_file, "w") as f:
            json.dump(self.history, f, indent=2)

    def load(self):
        try:
            with open(self.history_file, "r") as f:
                self.history = json.load(f)
        except Exception:
            self.history = []

    def export_for_finetune(self, out_path="llm_finetune_data.json"):
        """
        Eksportuje udane przypadki (lub wszystkie, jeśli chcesz RL/active learning) do fine-tuningu LLM.
        """
        export_data = []
        for entry in self.history:
            # Eksportuj tylko przypadki zakończone sukcesem
            feedback = entry.get("feedback") or {}
            if feedback.get("success"):
                export_data.append({
                    "prompt": entry.get("prompt"),
                    "code": entry.get("final_code"),
                    "feedback": feedback,
                    "test_results": entry.get("test_results"),
                    "lint_reports": entry.get("lint_reports")
                })
        import json
        with open(out_path, "w") as f:
            json.dump(export_data, f, indent=2)
        print(f"Exported {len(export_data)} examples to {out_path}")

# Przykład użycia
if __name__ == "__main__":
    ctx = ContextManager()
    ctx.add_entry({"command": "test", "result": "ok"})
    print(ctx.get_context())
