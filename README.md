# [TechTalk] LocalStack May 18, 2020

### Mac에서 Localstack 실행 시

TMPDIR=/private$TMPDIR docker-compose up

## Resource 생성 (AWSCLI || AWS LOCAL CLI)

How to use awslocal\
awslocal install https://github.com/localstack/awscli-local
```bash
aws --endpoint-url=http:YOUR_LOCALSTACK_ENDPOINT {SERVICE} {COMMAND}
awslocal {SERVICE} {COMMAND} //auto injection your LOCALSTACK_ENDPOINT
```

SNS topic 생성

```bash
awslocal sns create-topic --name my-topic
```

SQS FIFO queue 생성

```bash
awslocal sqs create-queue --queue-name my-queue
```

SQS SNS에 구독

```bash
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:my-topic \
--protocol sqs --notification-endpoint http://localhost:4576/queue/my-queue
```

SNS에 메세지 게시

```bash
awslocal sns publish --topic-arn arn:aws:sns:us-east-1:000000000000:my-topic --message "1 + 1 = 2"
```

SQS 대기열에 메시지 확인

```bash
awslocal sqs receive-message --queue-url http://localhost:4576/queue/my-queue
```

S3 bucket 생성
```bash
awslocal s3 mb s3://my-bucket
```

lambda 실행 역할 만들기

```bash
awslocal iam create-role --role-name lambda-x-role --assume-role-policy-document file://lambda-trust-policy.json
```

lambda 함수 생성

```bash
awslocal lambda create-function --function-name sqs-trigger \
--role arn:aws:iam::000000000000:role/lambda-x-role \
--zip-file fileb://function.zip --handler index.handler --runtime nodejs12.x \
--environment Variables={SLACK_WEBHOOK_URL=${YOUR_SLACK_WEBHOOK_URL}}
```

lambda 함수 invoke

```bash
awslocal lambda invoke --function-name sqs-trigger --payload file://sqs-trigger-test.json lambda-out.txt
```

SQS에 lambda trigger 등록 (sqs q arn 확인)

```bash
awslocal sqs get-queue-attributes --queue-url http://localhost:4576/queue/my-queue --attribute-names QueueArn
```

SQS에 lambda trigger 등록

```bash
awslocal lambda create-event-source-mapping --function-name sqs-trigger \
--batch-size 5 \
--event-source-arn arn:aws:sqs:us-east-1:000000000000:my-queue
```

cloudwatch event 확인 (log-group-name 확인)

```bash
awslocal logs describe-log-groups
```

cloudwatch event 확인 (log-stream-name 확인)

```bash
awslocal logs describe-log-streams
```

cloudwatch event 확인

```bash
aawslocal logs get-log-events --log-stream-name ${log-stream-name} --log-group-name ${log-group-name}
```

## Resource 생성 (Terraform)

Change Directory and Terraform apply

If you want to see SLACK WEBHOOK TRIGGER excution, You must set environment variable
`export TF_VAR_SLACK_WEBHOOK_URL={YOUR SLACK WEBHOOK URL}`
```bash
cd terraform
terraform init
terraform plan
terraform apply
```


