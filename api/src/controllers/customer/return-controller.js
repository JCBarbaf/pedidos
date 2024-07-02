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
    const reference = `R-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(new Date().getHours()).padStart(2, '0')}${String(new Date().getMinutes()).padStart(2, '0')}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`

    const returnData = {
      saleId: req.params.saleId,
      customerId: saleData.customerId,
      reference: reference,
      totalBasePrice: saleData.totalBasePrice,
      returnDate: new Date().toISOString().slice(0, 10),
      returnTime: new Date().toTimeString().slice(0, 8)
    }

    const [result, created] = await Return.findOrCreate({
      where: { saleId: req.params.saleId },
      defaults: returnData
    })

    if(created) res.status(200).send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}