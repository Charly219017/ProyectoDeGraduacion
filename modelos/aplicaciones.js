// carpeta backend/modelos/aplicaciones.js
module.exports = (sequelize, DataTypes) => {
  const Aplicaciones = sequelize.define('Aplicaciones', {
    id_aplicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    fecha_aplicacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'En Proceso',
      validate: {
        isIn: [['En Proceso', 'Contratado', 'Rechazado', 'Entrevista']]
      }
    },
    id_vacante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'aplicaciones',
    timestamps: false,
    indexes: [
      { fields: ['id_vacante', 'id_empleado'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  // Esto asegura que todos los modelos (como Vacantes) ya estén cargados
  Aplicaciones.associate = (models) => {
    Aplicaciones.belongsTo(models.Vacantes, {
      foreignKey: 'id_vacante',
      as: 'vacante'
    });

    Aplicaciones.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    Aplicaciones.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Aplicaciones.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Aplicaciones;
};
