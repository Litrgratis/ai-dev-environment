variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "eu-central-1"
}

variable "vpc_id" {
  description = "VPC ID for Ollama EC2 instance"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC ingress rules"
  type        = string
  default     = "0.0.0.0/0"
}

variable "gpu_ami_id" {
  description = "AMI ID for GPU-enabled EC2 instance"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type (e.g., g4dn.xlarge)"
  type        = string
  default     = "g4dn.xlarge"
}

variable "key_name" {
  description = "SSH key name for EC2 instance access"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for EC2 instance"
  type        = string
}
