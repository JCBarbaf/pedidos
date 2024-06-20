module.exports = function (sequelize, DataTypes) {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    commercialAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Dirección Commercial".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Dirección Commercial".'
        }
      }
    },
    fiscalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Dirección Fiscal".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Dirección Fiscal".'
        }
      }
    },
    commercialName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre Commercial".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre Commercial".'
        }
      }
    },
    fiscalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre Fiscal".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre Fiscal".'
        }
      }
    },
    vatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "NIF".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "NIF".'
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
    tableName: 'companies',
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
      }
    ]
  })

  Company.associate = function (models) {

  }

  return Company
}
