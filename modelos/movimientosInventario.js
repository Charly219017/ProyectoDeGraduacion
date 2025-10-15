// carpeta backend/modelos/movimientosInventario.js

module.exports = (sequelize, DataTypes) => {
  const MovimientosInventario = sequelize.define('MovimientosInventario', {
    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo_movimiento: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_movimiento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'movimientos_inventario',
    timestamps: true,
    createdAt: 'fecha_movimiento',
    updatedAt: false // No hay campo de fecha_actualizacion en la tabla
  });

  MovimientosInventario.associate = (models) => {
    MovimientosInventario.belongsTo(models.Productos, {
      foreignKey: 'id_producto',
      as: 'producto'
    });

    MovimientosInventario.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
  };

  return MovimientosInventario;
};
