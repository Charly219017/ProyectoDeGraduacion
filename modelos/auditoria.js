// carpeta backend/modelos/auditoria.js

module.exports = (sequelize, DataTypes) => {
  const Auditoria = sequelize.define('Auditoria', {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // Nombre del campo en el modelo para el ID de usuario
    usuario: { 
      type: DataTypes.INTEGER,
      // La columna en la BD se llama 'usuario', no necesitamos 'field'
      allowNull: true,
    },
    accion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_registro_afectado: {
      type: DataTypes.INTEGER,
      field: 'id_registro',
      allowNull: true
    },
    // Se corrige a 'descripcion' y se usa el tipo de dato TEXT
    descripcion: { 
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Se cambia el nombre del campo a 'fecha' para que coincida con la BD
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'auditoria',
    timestamps: false
  });

  Auditoria.associate = (models) => {
    Auditoria.belongsTo(models.Usuarios, {
      foreignKey: 'usuario',
      as: 'usuarioRelacionado'
    });
  };

  return Auditoria;
};
