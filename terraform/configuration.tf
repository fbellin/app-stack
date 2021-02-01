variable "aws_region" {
  default     = "eu-west-3"
  description = "AWS region"
}

data "aws_availability_zones" "available" {}

variable "cluster_name" {
  default = "training-eks-fbe"
  description = "Name of the k8s cluster, for training only"
}

resource "aws_key_pair" "default" {
  key_name   = "fbellin"
  public_key = file("~/.ssh/id_rsa.pub")
}
