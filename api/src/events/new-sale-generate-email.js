const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-sale-pdf', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-sale-pdf') {
      const emailService = new EmailService('gmail')
      const data = JSON.parse(message)

      emailService.sendEmail(data.saleInfo.customer, 'customer', 'orderDetails', data.saleInfo.sale, [data.pdfs])
    }
  })
}