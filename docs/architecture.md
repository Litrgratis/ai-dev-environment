# Architektura AI Dev Environment

## Diagram C4 (Mermaid)

```mermaid
graph TD
  A[User] -->|Prompt| B[Frontend: React]
  B -->|API Request| C[Backend: Express]
  C -->|Generate Code| D[LLM: Ollama/Gemini/OpenAI]
  D -->|Code Output| E[Generator]
  E -->|Analysis| F[Critic]
  F -->|Feedback| G[Pipeline]
  G -->|Improved Code| B
```

## Przepływ danych

1. Użytkownik wysyła prompt przez frontend (React/Next.js).
2. Frontend wysyła żądanie do backendu (Express API).
3. Backend przekazuje prompt do LLM (Ollama, Gemini, OpenAI, itp.).
4. Wynik trafia do generatora, następnie do krytyka (analiza, feedback).
5. Pipeline zwraca poprawiony kod do użytkownika.

## Komponenty
- **Frontend**: React/Next.js dashboard
- **Backend**: Express API, orchestrator, security, deployment
- **LLM**: Ollama, Gemini, OpenAI (modularnie)
- **Generator/Critic**: Moduły core (generator_critic.py, improver.py, tester.py)
- **Monitoring**: Prometheus, Grafana
- **Infrastruktura**: Docker, Kubernetes, CI/CD

## Rozszerzenia chmurowe
- Wrażliwe dane lokalnie, obliczenia w chmurze (hybryda)
- K8s deployment, autoskalowanie, monitoring

## Przykładowy przepływ requestu

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant L as LLM
    participant G as Generator
    participant C as Critic
    participant P as Pipeline
    U->>F: Prompt
    F->>B: API Request
    B->>L: Generate Code
    L->>G: Code Output
    G->>C: Analysis
    C->>P: Feedback
    P->>F: Improved Code
```
