// carpeta backend/modelos/auditoria.js

const { text } = require("express");

module.exports = (sequelize, DataTypes) => {
  const Auditoria = sequelize.define('Auditoria', {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
        
    id_registro_text: {
      type: DataTypes.TEXT,
      allowNull: true 
    },
    campo_modificado: {
      type:  DataTypes.TEXT,
      allowNull: true 
    },
    valor_anterior: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valor_nuevo: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    accion: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    usuario: { 
      type: DataTypes.INTEGER,
      
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE(6),
      defaultValue: DataTypes.NOW,
      allowNull: false
    }, 
    descripcion: { 
      type: DataTypes.TEXT,
      allowNull: true
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