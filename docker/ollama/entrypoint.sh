#!/bin/bash

# Start Ollama in the background
ollama serve &

# Wait for Ollama to be ready
sleep 10

# Pull required models
if [ -f /tmp/models-to-pull.txt ]; then
    while IFS= read -r model; do
        echo "Pulling model: $model"
        ollama pull "$model"
    done < /tmp/models-to-pull.txt
fi

# Keep the container running
wait
