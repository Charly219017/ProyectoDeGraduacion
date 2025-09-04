// carpeta backend/modelos/nomina.js
module.exports = (sequelize, DataTypes) => {
  const Nomina = sequelize.define('Nomina', {
    id_nomina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: 'nomina_unica', // Restricción de unicidad compuesta
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'nomina_unica', // Mismo nombre para la restricción
      validate: {
        min: 1,
        max: 12
      }
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'nomina_unica', // Mismo nombre para la restricción
      validate: {
        min: 2000
      }
    },
    sueldo_bruto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    bonificaciones: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sueldo_neto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    fecha_generacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'nomina',
    timestamps: false,
    indexes: [
      { fields: ['id_empleado'] },
      { fields: ['mes', 'anio'] },
      { fields: ['fecha_generacion'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Nomina.associate = (models) => {
    Nomina.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    Nomina.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Nomina.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Nomina;
};
