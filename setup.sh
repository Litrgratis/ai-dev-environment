#!/bin/bash

echo "🔧 [1/14] Audyt kodu i naprawa stylu"
npx eslint . --ext .tsx,.ts --fix
npx prettier --write .
npx depcheck

echo "🧪 [2/14] Test coverage"
npm run test:coverage || echo "🔸 Brak testów lub błąd testów"

echo "🛠️ [3/14] Konfiguracja środowiska VS Code"
mkdir -p .vscode

cat > .vscode/settings.json <<EOF
{
  "editor.formatOnSave": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
EOF

cat > .vscode/extensions.json <<EOF
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "ms-azuretools.vscode-docker",
    "mhutchie.git-graph"
  ]
}
EOF

echo "📄 [4/14] Dokumentacja techniczna"
mkdir -p docs
touch docs/ARCHITEKTURA.md docs/DECYZJE_PROJEKTOWE.md

echo "🔐 [5/14] Plik .env + gitignore"
touch .env
echo "OPENAI_API_KEY=sk-..." >> .env
echo ".env" >> .gitignore

echo "🐳 [6/14] Uruchamianie Docker (jeśli istnieje)"
[ -f docker-compose.yml ] && docker-compose up -d || echo "➡️ Pominięte: brak docker-compose.yml"

echo "☁️ [7/14] Terraform init"
if [ -d terraform ]; then
  cd terraform
  terraform init && terraform validate && terraform plan
  cd ..
else
  echo "➡️ Pominięte: brak katalogu terraform"
fi

echo "📁 [8/14] Tworzenie struktury ai-core"
mkdir -p ai-core/{generative,analytical,decisional,knowledge-base}
touch ai-core/generative/index.ts
touch ai-core/analytical/autohealer.ts
touch ai-core/decisional/trigger.ts

echo "📦 [9/14] Git LFS dla modeli AI"
git lfs install
git lfs track "*.gguf"
echo "*.gguf filter=lfs diff=lfs merge=lfs -text" >> .gitattributes
git add .gitattributes

echo "🔁 [10/14] Instrukcja rollback do rollback-k8s.txt"
echo "kubectl rollout undo deployment <deployment-name>" > rollback-k8s.txt

echo "🤖 [11/14] Przykładowy prompt AI w index.ts"
cat > ai-core/generative/index.ts <<EOF
const openai = require('openai');
const prompt = "Stwórz komponent React Button z propsami: text, onClick";
openai.createCompletion({
  model: "gpt-4",
  prompt
}).then(res => {
  console.log(res.data.choices?.[0]?.text);
});
EOF

echo "📋 [12/14] Zapis historii jako stan początkowy"
git log --format="%h %ad | %s" --date=short > docs/INITIAL_STATE.md

echo "✅ [13/14] Generowanie checklisty"
cat > CHECKLIST.md <<EOF
- [ ] Audyt kodu i linting
- [ ] Pokrycie testami
- [ ] Konfiguracja środowiska
- [ ] Przygotowanie .env i .gitignore
- [ ] Tworzenie dokumentacji
- [ ] Testowanie Docker
- [ ] Infrastruktura Terraform
- [ ] Struktura katalogów AI
- [ ] Git LFS
- [ ] Rollback plan
- [ ] MVP komponent AI
- [ ] Zapis stanu początkowego
- [ ] CI GitHub Actions
EOF

echo "⚙️ [14/14] Dodanie CI test.yml"
mkdir -p .github/workflows
cat > .github/workflows/test.yml <<EOF
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install deps
        run: npm install
      - name: Run tests
        run: npm run test
EOF

echo "✅ Setup zakończony pomyślnie! Możesz przystąpić do pracy 💻"
