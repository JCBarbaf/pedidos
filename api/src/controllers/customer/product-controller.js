const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product
const Op = sequelizeDb.Sequelize.Op

exports.findAll = (req, res) => {

  const productWhereStatement = {}
  productWhereStatement.deletedAt = { [Op.is]: null }
  productWhereStatement.visible = true

  const priceWhereStatement = {}
  priceWhereStatement.deletedAt = { [Op.is]: null }

  Product.findAll({
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
  .then(result => {
    res.status(200).send(result)
  }).catch(err => {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  })
}