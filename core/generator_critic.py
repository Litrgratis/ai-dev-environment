"""
GeneratorCriticLoop: Pętla Generator-Krytyk dla samokorygującej się architektury.
"""
from core.analyzer import CodeAnalyzer
from core.improver import Improver
from core.executor import Executor
from core.tester import Tester
from core.debugger import Debugger
from core.context_manager import ContextManager

class GeneratorCriticLoop:
    def __init__(self, max_iterations=5):
        self.analyzer = CodeAnalyzer()
        self.improver = Improver()
        self.executor = Executor()
        self.tester = Tester()
        self.debugger = Debugger()
        self.context = ContextManager()
        self.max_iterations = max_iterations

    def run(self, prompt: str):
        code = self.analyzer.generate_code({"prompt": prompt})
        for iteration in range(self.max_iterations):
            print(f"\n--- Iteration {iteration+1} ---")
            # 1. Wykonanie kodu
            stdout, stderr, exit_code = self.executor.run_python(code)
            # 2. Testowanie
            test_results = self.tester.run_tests(code)
            # 3. Analiza statyczna
            static_analysis = self.analyzer.analyze(code)
            # 4. Krytyk: analiza wyników
            feedback = self._critic_feedback(stdout, stderr, exit_code, test_results, static_analysis)
            print("Feedback:", feedback["explanation"])
            # 5. Sprawdzenie sukcesu
            if feedback["success"]:
                print("Code accepted after", iteration+1, "iterations.")
                self.context.add_entry({"prompt": prompt, "code": code, "feedback": feedback})
                return code
            # 6. Generator: poprawa kodu
            code = self.improver.improve(code)
        print("Max iterations reached. Last feedback:", feedback["explanation"])
        self.context.add_entry({"prompt": prompt, "code": code, "feedback": feedback})
        return code

    def _critic_feedback(self, stdout, stderr, exit_code, test_results, static_analysis):
        explanation = []
        success = True
        if exit_code != 0:
            explanation.append(f"Execution error: {stderr}")
            success = False
        if not test_results["passed"]:
            explanation.append(f"Test errors: {test_results['errors']}")
            success = False
        if static_analysis["flake8"]:
            explanation.append(f"Flake8 issues: {static_analysis['flake8']}")
            success = False
        if static_analysis["pylint"]:
            explanation.append(f"Pylint issues: {static_analysis['pylint']}")
            success = False
        if not explanation:
            explanation.append("All checks passed.")
        return {"success": success, "explanation": " | ".join(explanation)}

# Przykład użycia
if __name__ == "__main__":
    loop = GeneratorCriticLoop(max_iterations=3)
    prompt = "Napisz funkcję, która zwraca kwadrat liczby."
    final_code = loop.run(prompt)
    print("\nFinal code:\n", final_code)
