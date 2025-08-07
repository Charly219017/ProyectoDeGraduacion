// carpeta backend/modelos/vacantes.js

module.exports = (sequelize, DataTypes) => {
  const Vacantes = sequelize.define('Vacantes', {
    id_vacante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    titulo: {
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
    fecha_publicacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Abierta',
      validate: {
        isIn: [['Abierta', 'Cerrada', 'En Revisión', 'Cancelada']]
      }
    },
    id_puesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'vacantes',
    timestamps: false,
    indexes: [
      { fields: ['estado'] },
      { fields: ['id_puesto'] },
      { fields: ['fecha_publicacion'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Vacantes.associate = (models) => {
    // Un puesto pertenece a una carrera
    Vacantes.belongsTo(models.Puestos, {
      foreignKey: 'id_puesto',
      as: 'puesto'
    });

    // Un puesto pertenece a un usuario que lo creó
    Vacantes.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    // Un puesto pertenece a un usuario que lo actualizó
    Vacantes.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Vacantes;
};
