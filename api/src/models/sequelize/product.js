module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    productCategoryId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Referencia".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Referencia".'
        }
      }
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Unidades".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Unidades".'
        }
      }
    },
    measurementUnit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    measurement: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('createdAt')
          ? this.getDataValue('createdAt').toISOString().split('T')[0]
          : null
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('updatedAt')
          ? this.getDataValue('updatedAt').toISOString().split('T')[0]
          : null
      }
    }
  }, {
    sequelize,
    tableName: 'products',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'products_productCategoryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'productCategoryId' }
        ]
      }
    ]
  })

  Product.associate = function (models) {
    Product.belongsTo(models.ProductCategory, { as: 'productCategory', foreignKey: 'productCategoryId' })
    Product.hasMany(models.Price, { as: 'prices', foreignKey: 'productId' })
    Product.hasOne(models.Price, { as: 'price', foreignKey: 'productId', scope: { current: true } })
    Product.hasMany(models.SaleDetail, { as: 'saleDetails', foreignKey: 'productId' })
  }

  return Product
}
