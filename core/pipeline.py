#!/usr/bin/env python3
"""
Pipeline: Automatyzacja przetwarzania polecenia (parser → analyzer → tester → debugger → improver).
"""
import sys
import os
from pathlib import Path
import logging
import json
from datetime import datetime

# Dodaj katalog główny projektu do sys.path
sys.path.append(str(Path(__file__).parent.parent))

try:
    from core.parser import CommandParser
    from core.analyzer import CodeAnalyzer
    from core.tester import Tester
    from core.debugger import Debugger
    from core.improver import Improver
    from core.executor import Executor
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

logging.basicConfig(
    filename="pipeline.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

class Pipeline:
    def __init__(self):
        self.parser = CommandParser()
        self.analyzer = CodeAnalyzer()
        self.tester = Tester()
        self.debugger = Debugger()
        self.improver = Improver()
        self.executor = Executor()
        self.report = {"stages": [], "success": True, "timestamp": str(datetime.now())}

    def log_stage(self, stage, status, message):
        logger.info(f"Stage: {stage}, Status: {status}, Message: {message}")
        self.report["stages"].append({"stage": stage, "status": status, "message": message})

    def run(self, command):
        try:
            # Etap 1: Parsowanie
            self.log_stage("parsing", "started", "Parsing command")
            parsed_command = self.parser.parse(command)
            self.log_stage("parsing", "success", "Command parsed successfully")

            # Etap 2: Generowanie kodu
            self.log_stage("analysis", "started", "Generating code")
            code = self.analyzer.generate_code(parsed_command)
            self.log_stage("analysis", "success", "Code generated successfully")

            # Etap 3: Uruchomienie kodu (Execution)
            self.log_stage("execution", "started", "Running generated code")
            stdout, stderr, exit_code = self.executor.run_python(code)
            self.log_stage("execution", "success" if exit_code == 0 else "failed", f"stdout: {stdout}, stderr: {stderr}")

            # Etap 4: Testowanie
            self.log_stage("testing", "started", "Running tests")
            test_results = self.tester.run_tests(code)
            if not test_results["passed"]:
                self.log_stage("testing", "failed", f"Tests failed: {test_results['errors']}")
                # Etap 5: Debugowanie
                self.log_stage("debugging", "started", "Debugging code")
                debugged_code = self.debugger.debug(code, test_results["errors"])
                self.log_stage("debugging", "success", "Code debugged")
                code = debugged_code
            else:
                self.log_stage("testing", "success", "Tests passed")

            # Etap 6: Ulepszanie
            self.log_stage("improving", "started", "Improving code")
            improved_code = self.improver.improve(code)
            self.log_stage("improving", "success", "Code improved")

            # Zapis raportu
            with open("pipeline_report.json", "w") as f:
                json.dump(self.report, f, indent=2)
            return improved_code

        except Exception as e:
            self.log_stage("pipeline", "failed", f"Pipeline error: {str(e)}")
            self.report["success"] = False
            with open("pipeline_report.json", "w") as f:
                json.dump(self.report, f, indent=2)
            return None

if __name__ == "__main__":
    command = "Create a simple ML model for image classification"
    pipeline = Pipeline()
    result = pipeline.run(command)
    print(result)
