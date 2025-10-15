// carpeta backend/modelos/categoriasInventario.js

module.exports = (sequelize, DataTypes) => {
  const CategoriasInventario = sequelize.define('CategoriasInventario', {
    id_categoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_categoria: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
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
    tableName: 'categorias_inventario',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false // No hay campo de fecha_actualizacion en la tabla
  });

  CategoriasInventario.associate = (models) => {
    CategoriasInventario.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
    CategoriasInventario.hasMany(models.Productos, {
        foreignKey: 'id_categoria',
        as: 'productos'
    });
  };

  return CategoriasInventario;
};
