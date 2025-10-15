// carpeta backend/modelos/productos.js

module.exports = (sequelize, DataTypes) => {
  const Productos = sequelize.define('Productos', {
    id_producto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_producto: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    stock_actual: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  });

  Productos.associate = (models) => {
    Productos.belongsTo(models.CategoriasInventario, {
      foreignKey: 'id_categoria',
      as: 'categoria'
    });

    Productos.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Productos.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });

    Productos.hasMany(models.MovimientosInventario, {
        foreignKey: 'id_producto',
        as: 'movimientos'
    });
  };

  return Productos;
};
