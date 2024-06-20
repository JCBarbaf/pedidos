module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        },
        is: {
          args: /^[a-z0-9\sáéíóúüñÁÉÍÓÚÜÑ]+$/i,
          msg: 'Por favor, rellena el campo "Nombre" con un nombre válido, sin caracteres especiales.'
        }
      }
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Apellido".'
        },
        is: {
          args: /^[a-z0-9\sáéíóúüñÁÉÍÓÚÜÑ]+$/i,
          msg: 'Por favor, rellena el campo "Apellido" con un apellido válido, sin caracteres especiales.'
        }
      }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Teléfono".'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Email".'
        },
        isEmail: {
          msg: 'Por favor, rellena el campo "Email" con un email válido.'
        },
        isUnique: function (value, next) {
          const self = this
          Customer.findOne({ where: { email: value } }).then(function (customer) {
            if (customer && self.id !== customer.id) {
              return next('Ya existe un cliente con ese email.')
            }
            return next()
          }).catch(function (err) {
            return next(err)
          })
        }
      }
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
    tableName: 'customers',
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
        name: 'customer_email_index',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'email' }
        ]
      }
    ]
  })

  Customer.associate = function (models) {
    Customer.hasMany(models.Sale, { as: 'sales', foreignKey: 'customerId' })
    Customer.hasMany(models.SentEmail, { as: 'sentEmails', foreignKey: 'customerId' })
    Customer.hasMany(models.EmailError, { as: 'emailErrors', foreignKey: 'customerId' })
  }

  return Customer
}