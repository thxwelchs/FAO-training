resource "aws_lambda_function" "this" {
  function_name = "SQS-trigger"
  handler = "index.handler"
  filename = var.file_name
  role = aws_iam_role.lambda-exec-role.arn
  runtime = "nodejs12.x"
  environment {
    variables = {
      SLACK_WEBHOOK_URL = var.SLACK_WEBHOOK_URL
      BUCKET_NAME = aws_s3_bucket.this.bucket
      S3_ENDPOINT = var.ENDPOINT
    }
  }

  source_code_hash = var.source_hash_code
}

resource "aws_lambda_event_source_mapping" "this" {
  event_source_arn = aws_sqs_queue.this.arn
  function_name = aws_lambda_function.this.function_name
  batch_size = 5
}