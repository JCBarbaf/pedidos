const sequelizeDb = require('../models/sequelize')
const Price = sequelizeDb.Price

module.exports = class PriceManagementService {
  createPrice = async (productId, data) => {
    try {
      const priceData = {
        productId,
        basePrice: data.basePrice,
        current: true
      }

      let [price, created] = await Price.findOrCreate({
        attributes: ['id', 'basePrice', 'current'],
        where: { productId, current: true },
        defaults: priceData
      })

      if (!created && price.basePrice !== data.basePrice) {
        priceData.olderPriceId = price.id
        await price.update({ current: false })
        price = await Price.create(priceData)
      }

      priceData.priceId = price.id

      return priceData
    } catch (err) {
      return false
    }
  }
}