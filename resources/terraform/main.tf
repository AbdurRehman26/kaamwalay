# Configure the AWS Provider
terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 3.0"
        }
    }
}

provider "aws" {
    region = "us-west-2"
}

locals {
    stages = {
        "development" = "robograding-development",
        "staging" = "robograding-staging",
        "production" = "robograding-live",
    }
}

resource "aws_s3_bucket" "robograding" {
    for_each = local.stages
    bucket = each.value

    cors_rule {
        max_age_seconds = 3600
        allowed_methods = [
            "GET",
            "POST",
            "PUT",
        ]

        allowed_origins = [
            "*"
        ]

        expose_headers = [
            "ETag"
        ]

        allowed_headers = [
            "*"
        ]
    }
}

resource "aws_s3_bucket_policy" "robograding_read_policy" {
    for_each = local.stages
    bucket = aws_s3_bucket.robograding[each.key].bucket

    policy = <<POLICY
{
  "Id": "Policy1601415563808",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1601415561462",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${each.value}/*",
      "Principal": "*"
    }
  ]
}
POLICY

    depends_on = [
        aws_s3_bucket.robograding
    ]
}
