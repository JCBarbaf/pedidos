module.exports = (app) => {
  const router = require('express').Router()
  const controller = require('../controllers/customer/return-controller.js')

  router.post('/:saleId', controller.create)

  app.use('/api/customer/returns', router)
}