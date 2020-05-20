resource "aws_sns_topic" "this" {
  name = "my-topic"
}

resource "aws_sns_topic_subscription" "this" {
  endpoint = aws_sqs_queue.this.id
  protocol = "sqs"
  topic_arn = aws_sns_topic.this.arn
}