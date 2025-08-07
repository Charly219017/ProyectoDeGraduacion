// carpeta backend/modelos/evaluaciones.js
module.exports = (sequelize, DataTypes) => {
  const Evaluaciones = sequelize.define('Evaluaciones', {
    id_evaluacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_evaluacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    evaluador: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    puntuacion_total: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'evaluaciones',
    timestamps: false,
    indexes: [
      { fields: ['id_empleado'] },
      { fields: ['fecha_evaluacion'] },
      { fields: ['creado_por'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Evaluaciones.associate = (models) => {
    Evaluaciones.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    Evaluaciones.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return Evaluaciones;
};
