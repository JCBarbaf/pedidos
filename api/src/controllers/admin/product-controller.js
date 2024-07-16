const sequelizeDb = require('../../models/sequelize')
const Product = sequelizeDb.Product
const Op = sequelizeDb.Sequelize.Op
const PriceManagementService = require('../../services/price-management-service.js')
const GraphService = require('../../services/graph-service.js')

exports.create = (req, res) => {
  Product.create(req.body).then(async data => {
    const priceManagementService = new PriceManagementService
    priceManagementService.createPrice(data.id, req.body.price)

    const graphService = new GraphService()
    await graphService.createNode('Product', {id: parseInt(data.id), name: data.name, reference: data.reference, price: req.body.price.basePrice} )
    await graphService.createRelation('Product', 'BELONGS_TO', 'ProductCategory', {
      entityId : parseInt(data.id),
      relatedEntityId: parseInt(req.body.productCategoryId)
    })
    
    res.status(200).send(data)
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  })
}

exports.findAll = (req, res) => {

  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 100
  const offset = (page - 1) * limit

  Product.findAndCountAll({
    attributes: ['id', 'name', 'reference', 'units', 'measurementUnit', 'measurement', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })
    .then(result => {
      result.meta = {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page
      }

      res.status(200).send(result)
    }).catch(err => {
      console.log(err)
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Product.findByPk(id).then(data => {
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id

  Product.update(req.body, {
    where: { id }
  }).then(async ([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {

      const graphService = new GraphService()
      await graphService.createNode('Product', {id: parseInt(id), name: req.body.name, reference: req.body.reference, price: req.body.price.basePrice} )
      await graphService.createRelation('Product', 'BELONGS_TO', 'ProductCategory', {
        entityId : parseInt(id),
        relatedEntityId: parseInt(req.body.productCategoryId)
      })

      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al actualiazar la id=' + id
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Product.destroy({
    where: { id }
  }).then((numberRowsAffected) => {
    if (numberRowsAffected === 1) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  })
}