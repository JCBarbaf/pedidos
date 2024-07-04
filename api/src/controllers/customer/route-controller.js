const sequelizeDb = require('../../models/sequelize/index.js')
const Product = sequelizeDb.Product
const Op = sequelizeDb.Sequelize.Op
const PriceManagementService = require('../../services/price-management-service.js')

exports.findAll = (req, res) => {

  const routes = {
    '/cliente': 'home.html',
    '/cliente/productos': 'products.html',
    '/cliente/carrito': 'cart.html',
    '/cliente/pedidos': 'orders.html',
  }

  res.status(200).send(routes)
}