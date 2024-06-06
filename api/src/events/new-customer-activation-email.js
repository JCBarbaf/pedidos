const AuthorizationService = require('../services/authorization-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-customer', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-customer') {
      const customer = JSON.parse(message)
      console.log(customer)
      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(customer.id, 'customer')

      redisClient.publish('new-customer-token', JSON.stringify({
        activationUrl,
        customer
      }))
    }
  })
}