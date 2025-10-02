// carpeta backend/modelos/criterios.js
module.exports = (sequelize, DataTypes) => {
  const Criterios = sequelize.define('Criterios', {
    id_criterio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_criterio: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'criterios',
    timestamps: false
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Criterios.associate = (models) => {
    // Un criterio pertenece a un usuario que lo creó
    Criterios.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return Criterios;
};