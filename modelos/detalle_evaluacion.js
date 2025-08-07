// carpeta backend/modelos/detalle_evaluacion.js
module.exports = (sequelize, DataTypes) => {
  const DetalleEvaluacion = sequelize.define('DetalleEvaluacion', {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_evaluacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'evaluacion_criterio_unica', // Restricción de unicidad compuesta
    },
    id_criterio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'evaluacion_criterio_unica', // Mismo nombre para la restricción
    },
    puntuacion: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  }, {
    tableName: 'detalle_evaluacion',
    timestamps: false,
    indexes: [
      { fields: ['id_evaluacion'] },
      { fields: ['id_criterio'] },
      { fields: ['creado_por'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  DetalleEvaluacion.associate = (models) => {
    DetalleEvaluacion.belongsTo(models.Evaluaciones, {
      foreignKey: 'id_evaluacion',
      as: 'evaluacion'
    });

    DetalleEvaluacion.belongsTo(models.Criterios, {
      foreignKey: 'id_criterio',
      as: 'criterio'
    });

    DetalleEvaluacion.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return DetalleEvaluacion;
};
