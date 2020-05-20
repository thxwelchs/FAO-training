module "techtalk-demo" {
  source = "./modules/techtalk-demo"
  SLACK_WEBHOOK_URL = var.SLACK_WEBHOOK_URL
  file_name = data.archive_file.function.output_path
  source_hash_code = data.archive_file.function.output_base64sha256
}

data "archive_file" "function" {
  type = "zip"
  source_dir = "../sqs-trigger/"
  output_path = "./function.zip"
  depends_on = [null_resource.npm_install]
}

resource "null_resource" "npm_install" {
  provisioner "local-exec" {
    command = "npm install"
    working_dir = "../sqs-trigger/"
  }
}
