import time
from llm_integration import LLMIntegration
import tiktoken

def benchmark_llm(text, model="mistral:7b", iterations=10):
    encoder = tiktoken.get_encoding("cl100k_base")
    llm = LLMIntegration()
    prompt = f"Analyze this: {text}"
    total_tokens = 0
    total_time = 0
    valid_iterations = 0

    for i in range(iterations):
        try:
            start = time.time()
            response = llm.call_llm(prompt, model)
            # Upewnij się, że response jest stringiem
            if not isinstance(response, str):
                print(f"Iteration {i+1}: Invalid response type (expected string), skipping.")
                continue
            end = time.time()
            total_time += (end - start)
            total_tokens += len(encoder.encode(response))
            valid_iterations += 1
        except Exception as e:
            print(f"Iteration {i+1}: Error - {str(e)}. Skipping.")
            if "404" in str(e) or "model not found" in str(e):
                print(f"Model '{model}' not found in Ollama. Please run: ollama pull {model}")
                break

    if valid_iterations == 0:
        print("No valid iterations completed. Check model and LLM setup.")
        return
    avg_time = total_time / valid_iterations
    tokens_per_sec = total_tokens / total_time
    print(f"Avg tokens/s: {tokens_per_sec:.2f} (based on {valid_iterations} valid iterations)")

if __name__ == "__main__":
    text = "This is a test. " * 100
    benchmark_llm(text)
