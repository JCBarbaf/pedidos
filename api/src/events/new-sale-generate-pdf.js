const PdfService = require('../services/pdf-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-sale', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-sale') {
      const pdfService = new PdfService()
      const saleInfo = JSON.parse(message)
      const pdfs = await pdfService.createPdf(saleInfo.userId, saleInfo.userType, saleInfo.template, saleInfo.saleInfo)

      redisClient.publish('new-sale-pdf', JSON.stringify({
        pdfs,
        saleInfo: saleInfo.saleInfo
      }))
    }
  })
}