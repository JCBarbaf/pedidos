const sequelizeDb = require('../../models/sequelize')
const ProductCategory = sequelizeDb.ProductCategory
const Op = sequelizeDb.Sequelize.Op
const GraphService = require('../../services/graph-service')

exports.create = (req, res) => {
  ProductCategory.create(req.body).then(async data => {
    const graphService = new GraphService()
    await graphService.createNode('ProductCategory', {id: parseInt(data.id), name: data.name} )

    res.status(200).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  })
}

exports.findAll = (req, res) => {

  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit

  ProductCategory.findAndCountAll({
    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
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

  ProductCategory.findByPk(id).then(data => {
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

  ProductCategory.update(req.body, {
    where: { id }
  }).then(async ([numberRowsAffected]) => {
    if (numberRowsAffected === 1) {

      const graphService = new GraphService()
      await graphService.createNode('ProductCategory', {id: parseInt(id), name: req.body.name} )

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

  ProductCategory.destroy({
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