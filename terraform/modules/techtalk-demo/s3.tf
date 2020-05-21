resource "aws_s3_bucket" "this" {
  bucket = "my-bucket"
  force_destroy = true
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.this.bucket
  policy = jsonencode({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: aws_iam_role.lambda-exec-role.arn
        },
        Action: "s3:*",
        Resource: "arn:aws:s3:::${aws_s3_bucket.this.bucket}/logs/*"
      },
    ]
  })
}