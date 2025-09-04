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
    estado_aplicacion: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'En revisión',
      validate: {
        isIn: [['En revisión', 'Entrevista', 'Rechazado', 'Contratado']]
      }
    },
    id_vacante: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_candidato: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'aplicaciones',
    timestamps: true, // Habilitar para que maneje fecha_creacion
    createdAt: 'fecha_aplicacion', // La BD usa fecha_aplicacion como timestamp de creación
    updatedAt: false, // No hay columna de actualización
    indexes: [
      { fields: ['id_vacante', 'id_candidato'] }
    ]
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  // Esto asegura que todos los modelos (como Vacantes) ya estén cargados
  Aplicaciones.associate = (models) => {
    Aplicaciones.belongsTo(models.Vacantes, {
      foreignKey: 'id_vacante',
      as: 'vacante'
    });

    Aplicaciones.belongsTo(models.Candidatos, {
      foreignKey: 'id_candidato',
      as: 'candidato'
    });

    Aplicaciones.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return Aplicaciones;
};
