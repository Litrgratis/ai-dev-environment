FROM ollama/ollama:latest

RUN apt-get update && apt-get install -y curl

COPY ./models-to-pull.txt /tmp/models-to-pull.txt
COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 11434

ENTRYPOINT ["/entrypoint.sh"]
