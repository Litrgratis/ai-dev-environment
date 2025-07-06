#!/bin/bash
# Skrypt do przenoszenia projektu ai-dev-environment na inną maszynę
# Użycie: ./move_project.sh user@IP:/sciezka/docelowa/

set -e

if [ -z "$1" ]; then
  echo "Użycie: $0 user@IP:/ścieżka/docelowa/"
  exit 1
fi

# Spakuj projekt
cd "$(dirname "$0")"
tar czf ai-dev-environment.tar.gz .

# Skopiuj na nową maszynę
scp ai-dev-environment.tar.gz "$1"

# Instrukcje dla nowej maszyny
cat <<EOF

--- Instrukcje dla nowej maszyny ---
cd /ścieżka/docelowa/
tar xzf ai-dev-environment.tar.gz

# Python
pip install -r requirements.txt
pip install -r tests/requirements.txt

# Node.js
cd backend
npm install

# Docker (jeśli używasz)
sudo apt update && sudo apt install docker.io docker-compose

# Skonfiguruj .env
cp .env.example .env # i uzupełnij klucze API

# Uruchom backend
cd backend
npm start

# Uruchom pipeline Python
cd ..
python3 -m core.pipeline

# (Opcjonalnie) Docker Compose
docker-compose up

---
EOF
