module.exports = (app, upload) => {
  const router = require('express').Router()
  const uploadFiles = require('../middlewares/upload-files.js')
  const controller = require('../controllers/front/image-controller.js')

  router.get('/image/:filename', controller.getImage)

  app.use('/api/front/images', router)
}