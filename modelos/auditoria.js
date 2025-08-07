// carpeta backend/modelos/auditoria.js

module.exports = (sequelize, DataTypes) => {
  const Auditoria = sequelize.define('Auditoria', {
    // La clave primaria en la BD es 'id_log'
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // La columna en la BD se llama 'usuario'
    id_usuario: {
      type: DataTypes.INTEGER,
      field: 'usuario',
      allowNull: true, // Lo cambiamos a true porque puede ser nulo en caso de un login fallido
    },
    accion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    // La columna en la BD se llama 'tabla_afectada'
    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    // La columna en la BD se llama 'id_registro'
    id_registro_afectado: {
      type: DataTypes.INTEGER,
      field: 'id_registro',
      allowNull: true
    },
    // La columna en la BD se llama 'descripcion'
    detalles: {
      type: DataTypes.JSON, // Cambia a JSONB para que coincida con el tipo de datos de tu base de datos
      field: 'descripcion',
      allowNull: true
    },
    // La columna en la BD se llama 'fecha'
    fecha_accion: {
      type: DataTypes.DATE,
      field: 'fecha',
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'auditoria',
    timestamps: false
  });

  Auditoria.associate = (models) => {
    Auditoria.belongsTo(models.Usuarios, {
      // La clave foránea en la tabla es 'usuario'
      foreignKey: 'usuario',
      as: 'usuarioRelacionado' // Alias para la asociación
    });
  };

  return Auditoria;
};
