const sequelizeDb = require('../../models/sequelize')
const Return = sequelizeDb.Return
const Sale = sequelizeDb.Sale
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res) => {
  try {
    const saleWhereStatement = {}
    saleWhereStatement.deletedAt = { [Op.is]: null }
    saleWhereStatement.id = req.params.saleId

    const saleData = await Sale.findOne({
      where: saleWhereStatement
    })

    const returnData = {
      saleId: req.params.saleId,
      customerId: saleData.customerId,
      reference: saleData.reference,
      totalBasePrice: saleData.totalBasePrice,
      returnDate: new Date().toISOString().slice(0, 10),
      returnTime: new Date().toTimeString().slice(0, 8)
    }

    console.log('--------data-----', returnData)

    const result = await Return.create(returnData)

    res.status(200).send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}