// carpeta backend/modelos/vacaciones.js
module.exports = (sequelize, DataTypes) => {
  const Vacaciones = sequelize.define('Vacaciones', {
    id_vacacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isDate: true
      }
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Pendiente',
      validate: {
        isIn: [['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada']]
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
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'vacaciones',
    timestamps: false,
    indexes: [
      { fields: ['id_empleado'] },
      { fields: ['estado'] },
      { fields: ['fecha_inicio', 'fecha_fin'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Vacaciones.associate = (models) => {
    Vacaciones.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    Vacaciones.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Vacaciones.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Vacaciones;
};
