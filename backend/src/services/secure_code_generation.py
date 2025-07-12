from input_sanitizer import sanitize_input
from sandbox import Sandbox

def ollama_generate_code(prompt: str) -> str:
    # Tu powinna być integracja z Ollama LLM
    # Przykład: return ollama_client.generate_code(prompt)
    return f"print('Generated for: {prompt}')"  # Mock

def code_review(code: str) -> bool:
    # Prosta kontrola bezpieczeństwa (można rozbudować)
    disallowed = ["os.system", "subprocess", "eval", "exec"]
    return not any(x in code for x in disallowed)

def execute_in_sandbox(code: str) -> str:
    import os
    test_mode = os.environ.get("SANDBOX_TEST_MODE") == "1"
    from sandbox import Sandbox
    sandbox = Sandbox(test_mode=test_mode)
    return sandbox.run_code(code, language="python")

def generate_code(user_prompt: str) -> str:
    safe_prompt = sanitize_input(user_prompt)
    llm_response = ollama_generate_code(safe_prompt)
    if not code_review(llm_response):
        raise ValueError("Generowany kod nie spełnia wymogów bezpieczeństwa.")
    result = execute_in_sandbox(llm_response)
    return result
