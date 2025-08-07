// carpeta backend/modelos/contratos.js
module.exports = (sequelize, DataTypes) => {
  const Contratos = sequelize.define('Contratos', {
    id_contrato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_contrato: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['Indefinido', 'Temporal', 'Por Obra', 'Prácticas']]
      }
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    observaciones: {
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
    tableName: 'contratos',
    timestamps: false,
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Contratos.associate = (models) => {
    // Un contrato pertenece a un empleado
    Contratos.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    // Un contrato pertenece a un usuario que lo creó
    Contratos.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    // Un contrato pertenece a un usuario que lo actualizó
    Contratos.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Contratos;
};
