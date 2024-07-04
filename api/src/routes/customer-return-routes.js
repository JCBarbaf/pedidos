module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/return-controller.js')

  router.post('/:saleId', [authCustomerJwt.verifyCustomerToken], controller.create)

  app.use('/api/customer/returns', router)
}