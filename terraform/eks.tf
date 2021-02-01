module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.17"
  vpc_id = module.vpc.vpc_id
  subnets         = module.vpc.private_subnets

  tags = {
    Environment = "training"
    Owner  = "fbe"
  }

}

data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}
