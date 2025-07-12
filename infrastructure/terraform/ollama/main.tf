terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_security_group" "ollama_sg" {
  name        = "ollama-security-group"
  description = "Security group for Ollama service"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 11434
    to_port     = 11434
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ollama-sg"
  }
}

resource "aws_instance" "ollama" {
  ami           = var.gpu_ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  vpc_security_group_ids = [aws_security_group.ollama_sg.id]
  subnet_id     = var.subnet_id
  tags = {
    Name = "ollama-instance"
  }
}
