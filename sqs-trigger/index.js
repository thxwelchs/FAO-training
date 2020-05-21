const axios = require('axios')
const AWS = require('aws-sdk');
const moment = require('moment');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || ''
const BUCKET_NAME = process.env.BUCKET_NAME || 'my-bucket'
// const S3_ENDPOINT = process.env.S3_ENDPOINT ? process.env.S3_ENDPOINT.replace(/127.0.0.1/gi, 'localhost') : `lambda.${process.env.AWS_REGION}.amazonaws.com`
const S3_ENDPOINT = `http://${process.env.LOCALSTACK_HOSTNAME}:4572`

const s3 = new AWS.S3({
  endpoint: S3_ENDPOINT,
  s3ForcePathStyle: process.env.S3_ENDPOINT || false,
})

exports.handler = async (event, context) => {

  try {
    const datas = []

    event.Records.forEach(({body}) => {
      if (!body) {
        throw new Error(`message is empty`)
      }

      body = JSON.parse(body)

      if (!body || !body.Message || !new RegExp(/^[0-9]\d* [+|\-|/|*] [0-9]\d* [=] [0-9]\d*$/).test(body.Message)) {
        throw new Error(`message is not vaild`)
      }

      const {Message, Timestamp} = body

      const slices = Message.split(' ')
      const question = `${slices[0]}${slices[1]}${slices[2]}`
      const correctAnswer = eval(question)
      const result = correctAnswer === +(slices[4])
      const data = `문제: ${slices.filter((n, i) => i < 3).join(' ')}, 풀이: ${slices[4]}, 정답: ${correctAnswer} (${result ? 'O' : 'X'})`
      datas.push(data)
    })

    const userId = 'xxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random()*16|0
        const v = c === 'x' ? r : (r&0x3|0x8);

        return v.toString(16);
    })

    const objectKey = `logs/${moment().format('YYYY/MM/DD/HH')}/${userId}/user_log`

    const result = await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: datas.join('\n')
    }).promise()

    await axios.post(SLACK_WEBHOOK_URL, {
      text: `*${userId}* 유저가 문제를 풀었습니다!`,
      attachments: [
        {
          text: `채점 결과: s3://${BUCKET_NAME}/${objectKey}`
        }
      ]
    })

    return { status: 200 }
  }
  catch (err) {
    console.log(`error: ${err}`)
    return { status: 500, error: err }
  }
}

