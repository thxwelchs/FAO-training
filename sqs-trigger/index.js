const axios = require('axios')

const SLACK_WEBHOOK_URL= process.env.SLACK_WEBHOOK_URL || ''

exports.handler = async (event, context) => {

  const promises = []


  // 1 + 1 = 2
  event.Records.forEach( ({ body })  => {
    try {
      if(!body) {
        throw new Error(`message is empty`)
      }

      body = JSON.parse(body)

      if(!body || !body.Message || !new RegExp(/^[0-9]\d* [+|\-|/|*] [0-9]\d* [=] [0-9]\d*$/).test(body.Message)) {
        throw new Error(`message is not vaild`)
      }

      const { Message, Timestamp } = body

      const slices = Message.split(' ')
      const question = `${slices[0]}${slices[1]}${slices[2]}`
      const correctAnswer = eval(question)
      const result = correctAnswer === +(slices[4])

      promises.push(axios.post(SLACK_WEBHOOK_URL, {
        text: `문제: ${slices.filter( (n, i) => i < 3).join(' ')}, 풀이: ${slices[4]}, 정답: ${correctAnswer} (${result ? 'O' : 'X'})`
      }))

    } catch (err) {
      console.log(`error: ${err}`)
    }
  })

  if(promises.length) await Promise.all(promises)

  return {}
}
