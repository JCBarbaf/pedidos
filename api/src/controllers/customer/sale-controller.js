const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product
const Sale = sequelizeDb.Sale
const SaleDetail = sequelizeDb.SaleDetail
const Return = sequelizeDb.Return
const Customer = sequelizeDb.Customer
const Op = sequelizeDb.Sequelize.Op
const GraphService = require('../../services/graph-service.js')

exports.findByCustomer = async (req, res) => {
  try {
    const saleWhereStatement = {}
    saleWhereStatement.deletedAt = { [Op.is]: null }
    saleWhereStatement.customerId = req.customerId
  
    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        saleWhereStatement[key] = { [Op.substring]: req.query[key] }
      }
    }
  
    let sales = await Sale.findAll({
      where: saleWhereStatement,
      order: [['createdAt', 'DESC']]
    })

    sales = sales.map(sale => sale.get({ plain: true }))
    
    const saleIds = sales.map(sale => sale.id);

    const returnWhereStatement = {}
    returnWhereStatement.deletedAt = { [Op.is]: null }
    returnWhereStatement.saleId = { [Op.in]: saleIds }

    const returns = await Return.findAll({
      where: returnWhereStatement,
      attributes: ['saleId']
    })
    
    const returnedSaleIds = new Set(returns.map(returnRecord => returnRecord.saleId))
    
    sales.forEach(sale => {
      sale.returned = returnedSaleIds.has(sale.id)
    })
    res.status(200).send(sales)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: error.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}

exports.findSaleDetails = (req, res) => {
  const saleWhereStatement = {}
  saleWhereStatement.deletedAt = { [Op.is]: null }
  saleWhereStatement.saleId = req.params.saleId

  SaleDetail.findAll({
    where: saleWhereStatement,
    order: [['createdAt', 'DESC']]
  })
  .then(result => {
    res.status(200).send(result)
  }).catch(err => {
    console.log('---------------error-------------',err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  })
}

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
    const reference = `S-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
    const saleData = {
      customerId: 1,
      reference: reference,
      totalBasePrice: parseFloat(totalBasePrice).toFixed(2),
      saleDate: new Date().toISOString().slice(0, 10),
      saleTime: new Date().toTimeString().slice(0, 8)
    }
    const sale = await Sale.create(saleData)

    const graphService = new GraphService()

    await graphService.createNode('Sale', {
      id: parseInt(sale.dataValues.id), 
      reference: sale.reference, 
      totalBasePrice: sale.totalBasePrice, 
      saleDate: sale.saleDate,
      saleTime: sale.saleTime
    })

    await graphService.createRelation('Customer', 'PURCHASED', 'Sale', {
      entityId : parseInt(req.customerId),
      relatedEntityId: parseInt(sale.dataValues.id)
    })

    const saleDetailsData = products.map(product => {
      const saleDetailData = {
        saleId: parseInt(sale.dataValues.id),
        productId: parseInt(product.id),
        priceId: parseInt(product.price.dataValues.id),
        productName: product.name,
        basePrice: product.price.dataValues.basePrice,
        quantity: product.quantity
      }
      return saleDetailData
    })
    
    for (const saleDetail of saleDetailsData) {
      await graphService.createRelation('Sale', 'CONTAINS', 'Product', {
        entityId: parseInt(saleDetail.saleId),
        relatedEntityId: parseInt(saleDetail.productId),
        properties: {
          quantity: saleDetail.quantity
        }
      })
    }

    await SaleDetail.bulkCreate(saleDetailsData)

    const customer = await Customer.findByPk(req.customerId)

    const saleInfo = {
      sale,
      customer,
      saleDetailsData
    }

    // req.redisClient.publish('new-sale', JSON.stringify({
    //   userId: req.customerId,
    //   userType: 'customer',
    //   template: 'order-details',
    //   saleInfo
    // }))

    res.status(200).send(sale)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}