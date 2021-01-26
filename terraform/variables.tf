variable "region" {
  default     = "eu-west-3"
  description = "AWS region"
}

data "aws_availability_zones" "available" {}

variable "cluster_name" {
  default = "training-eks-fbe"
  description = "Name of the k8s cluster, for training only"
}