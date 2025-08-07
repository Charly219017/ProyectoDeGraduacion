// carpeta backend/modelos/puestos.js
module.exports = (sequelize, DataTypes) => {
  const Puestos = sequelize.define('Puestos', {
    id_puesto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_puesto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    salario_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    id_carrera: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'puestos',
    timestamps: false,
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Puestos.associate = (models) => {
    // Un puesto pertenece a una carrera
    Puestos.belongsTo(models.Carreras, {
      foreignKey: 'id_carrera',
      as: 'carrera'
    });
    // Un puesto pertenece a un usuario que lo creó
    Puestos.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });
    // Un puesto pertenece a un usuario que lo actualizó
    Puestos.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Puestos;
};
