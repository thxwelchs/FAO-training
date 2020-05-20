describe('SNS topic publish test', () => {
  let topicArn
  let SNS

  before('given AWS SDK', () => {
    const AWS = require('aws-sdk')
    const LOCALSTACK_ENDPOINT = 'http://localhost:4566'
    AWS.config.update({
      accessKeyId: 'mock_access_key',
      secretAccessKey: 'mock_secret_key',
      region: 'us-east-1'
    });
    SNS = new AWS.SNS({
      endpoint: LOCALSTACK_ENDPOINT
    })
  })

  it('should publish message to topic', (done) => {
    const questions = [
      '1 + 1 = 9',
      '1 + 2 = 4',
      '2 + 2 = 4',
      '4 * 4 = 16',
      '999 * 999 = 998001',
    ]

    SNS.listTopics({}).promise()
      .then( topics => {
        if(!topics.Topics || !topics.Topics.length) return
        const topic = topics.Topics.find( (topic) => topic && topic.TopicArn && /arn:aws:sns:us-east-1:([0-9]*\d{12}):my-topic/.test(topic.TopicArn))
        if(!topic || !topic.TopicArn) return
        console.log(topic.TopicArn)

         return Promise.all(questions.map( q => SNS.publish({
          Message: q,
          TopicArn: topic.TopicArn
          }).promise()))
      }).then( published => {
        console.log(published)
      })
      .catch()
  })
})
