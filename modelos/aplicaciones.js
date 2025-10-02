// carpeta backend/modelos/aplicaciones.js
module.exports = (sequelize, DataTypes) => {
  const Aplicaciones = sequelize.define('Aplicaciones', {
    id_aplicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
     id_vacante: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
      id_candidato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado_aplicacion: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: 'En revisión',
      validate: {
        isIn: [['En revisión', 'Entrevista', 'Rechazado', 'Contratado']]
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
      fecha_aplicacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'aplicaciones',
    timestamps: true, // Habilitar para que maneje fecha_creacion
    createdAt: 'fecha_aplicacion', // La BD usa fecha_aplicacion como timestamp de creación
    updatedAt: false, // No hay columna de actualización

  });

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