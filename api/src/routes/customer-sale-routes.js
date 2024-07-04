module.exports = (app) => {
  const router = require('express').Router()
  const authCustomerJwt = require('../middlewares/auth-customer-jwt.js')
  const controller = require('../controllers/customer/sale-controller.js')

  router.post('/', [authCustomerJwt.verifyCustomerToken], controller.create)
  router.get('/', [authCustomerJwt.verifyCustomerToken], controller.findByCustomer)
  router.get('/details/:saleId', [authCustomerJwt.verifyCustomerToken], controller.findSaleDetails)

  app.use('/api/customer/sales', router)
}