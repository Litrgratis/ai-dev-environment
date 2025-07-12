# Security Scanning Step for GitHub Actions

Add the following job to your `.github/workflows/ci.yml`:

```yaml
name: Security Scan
on:
  push:
    branches: [ main, ollama-integration ]
  pull_request:
    branches: [ main, ollama-integration ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      - name: Run Bandit (Python)
        run: |
          pip install bandit
          bandit -r .
      - name: Upload audit report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: bandit-report.json
```

Ten krok uruchamia skanowanie npm audit oraz Bandit dla kodu Python, a raport jest dostępny jako artefakt w workflow.
