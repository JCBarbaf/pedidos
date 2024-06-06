module.exports = (app, upload) => {
  const router = require('express').Router()
  const authCookie = require('../middlewares/auth-cookie.js')
  const controller = require('../controllers/admin/user-controller.js')

  router.post('/', [authCookie.verifyUserCookie], controller.create)
  router.get('/', [authCookie.verifyUserCookie], controller.findAll)
  router.get('/:id', [authCookie.verifyUserCookie], controller.findOne)
  router.put('/:id', [authCookie.verifyUserCookie], controller.update)
  router.delete('/:id', [authCookie.verifyUserCookie], controller.delete)

  // router.post('/',controller.create)
  // router.get('/', controller.findAll)
  // router.get('/:id', controller.findOne)
  // router.put('/:id', controller.update)
  // router.delete('/:id', controller.delete)

  app.use('/api/admin/users', router)
}