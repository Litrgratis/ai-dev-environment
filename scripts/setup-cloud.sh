#!/bin/bash
# scripts/setup-cloud.sh
# Automatyczna konfiguracja środowiska chmurowego (AWS/GCP)

set -e

if [ -z "$CLOUD_PROVIDER" ]; then
  echo "CLOUD_PROVIDER env variable not set (aws/gcp)"
  exit 1
fi

if [ "$CLOUD_PROVIDER" = "aws" ]; then
  echo "Konfiguracja AWS CLI..."
  if ! command -v aws &> /dev/null; then
    echo "Instalacja AWS CLI..."
    pip install awscli
  fi
  aws configure
  echo "AWS CLI skonfigurowane."
elif [ "$CLOUD_PROVIDER" = "gcp" ]; then
  echo "Konfiguracja GCP SDK..."
  if ! command -v gcloud &> /dev/null; then
    echo "Instalacja Google Cloud SDK..."
    sudo apt-get update && sudo apt-get install -y google-cloud-sdk
  fi
  gcloud init
  echo "GCP SDK skonfigurowane."
else
  echo "Nieobsługiwany dostawca chmury: $CLOUD_PROVIDER"
  exit 1
fi

echo "Konfiguracja kubectl..."
if ! command -v kubectl &> /dev/null; then
  echo "Instalacja kubectl..."
  curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
fi

if [ -n "$K8S_CONFIG_PATH" ]; then
  export KUBECONFIG="$K8S_CONFIG_PATH"
  echo "Użyto KUBECONFIG=$K8S_CONFIG_PATH"
fi

echo "Środowisko chmurowe gotowe."
