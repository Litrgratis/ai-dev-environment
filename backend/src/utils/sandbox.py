import docker

import os
class Sandbox:
    def __init__(self, test_mode: bool = False):
        self.test_mode = test_mode or os.environ.get("SANDBOX_TEST_MODE") == "1"
        if not self.test_mode:
            import docker
            self.client = docker.from_env()

    def run_code(self, code: str, language: str = "python") -> str:
        if self.test_mode:
            return f"[MOCK] sandboxed: {code[:32]}..."
        image_map = {
            "python": "python:3.11-alpine",
            "node": "node:20-alpine"
        }
        image = image_map.get(language)
        if not image:
            raise ValueError("Unsupported language")
        container = self.client.containers.run(
            image,
            command="sleep infinity",
            detach=True,
            mem_limit="256m",
            cpu_quota=25000,
            network_disabled=True
        )
        # ...copy code, exec, cleanup...
        container.remove(force=True)
        return "sandboxed execution complete"
