// carpeta backend/modelos/candidatos.js

module.exports = (sequelize, DataTypes) => {
  const Candidatos = sequelize.define('Candidatos', {
    id_candidato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado_candidatura: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'En Revisión'
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
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'candidatos',
    timestamps: false
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Candidatos.associate = (models) => {
    // Un candidato pertenece a un empleado
    Candidatos.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    // Un candidato pertenece a un usuario que lo creó
    Candidatos.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    // Un candidato pertenece a un usuario que lo actualizó
    Candidatos.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Candidatos;
};
