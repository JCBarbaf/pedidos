const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product
const Sale = sequelizeDb.Sale
const SaleDetail = sequelizeDb.SaleDetail
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res) => {
  try {
    const productsIds = req.body.products.map(product => product.id)
    const productWhereStatement = {}
    productWhereStatement.deletedAt = { [Op.is]: null }
    productWhereStatement.visible = true
    productWhereStatement.id = { [Op.in]: productsIds }
    let products = await Product.findAll({
      where: productWhereStatement,
      order: [['createdAt', 'DESC']],
      include: [
        {
          attributes: ['id', 'basePrice', 'deletedAt'],
          model: sequelizeDb.Price,
          as: 'price'
        }
      ]
    })
    products = products.map(product => {
      const matchingProduct = req.body.products.find(p => p.id === product.id);
      return {
        ...product.dataValues,
        quantity: matchingProduct ? matchingProduct.quantity : 0
      }
    })
    const totalBasePrice = products.reduce((sum, product) => {
      return sum + (product.price && product.price.basePrice ? product.price.basePrice * product.quantity : 0)
    }, 0)
    const reference = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(2).padStart(3, '0')}`
    const saleData = {
      customerId: 1,
      reference: reference,
      totalBasePrice: parseFloat(totalBasePrice).toFixed(2),
      saleDate: new Date().toISOString().slice(0, 10),
      saleTime: new Date().toTimeString().slice(0, 8)
    }
    const sale = await Sale.create(saleData)
    const saleDetailsData = products.map(product => {
      const saleDetailData = {
        saleId: sale.dataValues.id,
        productId: product.id,
        priceId: product.price.dataValues.id,
        productName: product.name,
        basePrice: product.price.dataValues.basePrice,
        quantity: product.quantity
      }
      return saleDetailData
    })
    await SaleDetail.bulkCreate(saleDetailsData)
    res.status(200).send(sale)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}