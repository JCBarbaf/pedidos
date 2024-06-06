const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const Faq = mongooseDb.Faq

exports.findAll = async (req, res) => {
  const whereStatement = {}
  whereStatement.deletedAt = { $exists: false }

  try {
    const result = await Faq.find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const response = result.map(doc => ({
      locales: doc.locales[req.userLanguage],
      images: doc.images
    }))

    res.status(200).send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Algún error ha surgido al recuperar los datos.'
    })
  }
}