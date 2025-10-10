// backend/modelos/bienestar.js
module.exports = (sequelize, DataTypes) => {
  const Bienestar = sequelize.define('Bienestar', {
    id_bienestar: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_actividad: {
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
    fecha_actividad: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'bienestar',
    timestamps: false,
  });

  Bienestar.associate = (models) => {
    Bienestar.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return Bienestar;
};