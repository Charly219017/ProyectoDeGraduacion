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
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    dpi: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: true,
      validate: {
        len: [0, 25]
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    correo_personal: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
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
      allowNull: true,
      validate: {
        isIn: [['Masculino', 'Femenino', 'Otro']]
      }
    },
    estado_civil: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        isIn: [['Soltero', 'Casado', 'Divorciado', 'Viudo']]
      }
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    id_puesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Se elimina estado_empleo para evitar redundancia. Usaremos estadoEmpleado.
    estadoEmpleado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'estadoempleado' // Mapea al nombre de la columna en la BD (PostgreSQL lo pone en minúsculas)
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'empleados',
    timestamps: true,
  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Empleados.associate = (models) => {
    // Un empleado pertenece a un puesto
    Empleados.belongsTo(models.Puestos, {
      foreignKey: 'id_puesto',
      as: 'puesto'
    });

    // Un empleado pertenece a un usuario que lo creó
    Empleados.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    // Un empleado pertenece a un usuario que lo actualizó
    Empleados.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Empleados;
};
