// carpeta backend/modelos/empleado.js

module.exports = (sequelize, DataTypes) => {
  const Empleados = sequelize.define('Empleados', {
    id_empleado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dpi: {
      type: DataTypes.STRING(13),
      unique: true,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    correo_personal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    genero: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    estado_civil: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    id_puesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado_empleo: {
      type: DataTypes.STRING(20),
      defaultValue: 'Activo'
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
    tableName: 'empleados',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion'
  });

  Empleados.associate = (models) => {
    Empleados.belongsTo(models.Puestos, {
      foreignKey: 'id_puesto',
      as: 'puesto'
    });

    Empleados.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Empleados.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Empleados;
};