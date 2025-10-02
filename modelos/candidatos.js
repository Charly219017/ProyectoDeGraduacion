// carpeta backend/modelos/candidatos.js

module.exports = (sequelize, DataTypes) => {
  const Candidatos = sequelize.define('Candidatos', {
    id_candidato: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cv_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_aplicacion: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: true
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'candidatos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Candidatos.associate = (models) => {
    // Un candidato pertenece a un usuario que lo creó
    Candidatos.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return Candidatos;
};
