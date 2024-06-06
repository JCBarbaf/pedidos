const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer-token', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer-token') {
      const emailService = new EmailService('gmail')
      const data = JSON.parse(message)

      emailService.sendEmail(data.customer, 'customer', 'activationUrl', data)
    }
  })
}