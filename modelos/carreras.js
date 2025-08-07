// Carpeta backend/modelos/carrera.js
module.exports = (sequelize, DataTypes) => {
  const Carreras = sequelize.define('Carreras', {
    id_carrera: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_carrera: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'carreras',
    timestamps: false,
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Carreras.associate = (models) => {
    // Una carrera pertenece a un usuario que la creó
    Carreras.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
    // Una carrera pertenece a un usuario que la actualizó
    Carreras.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Carreras;
};
