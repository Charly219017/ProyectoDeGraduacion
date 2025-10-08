// carpeta backend/modelos/nomina.js
module.exports = (sequelize, DataTypes) => {
  const Nomina = sequelize.define('Nomina', {
    id_nomina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2000
      }
    },

    // DATOS DE ENTRADA PARA EL CÁLCULO
    salario_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    horas_extras: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    comisiones: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    isr: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    otros_descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },

    // VALORES CALCULADOS Y ALMACENADOS
    bonificacion_decreto: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    pago_horas_extras: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    total_ingresos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    deduccion_igss: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    total_descuentos: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    sueldo_liquido: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },

    // CAMPOS DE AUDITORÍA
    fecha_generacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    creado_por: {
      type: DataTypes.INTEGER
    },
    actualizado_por: {
      type: DataTypes.INTEGER
    },
    fecha_actualizacion: {
      type: DataTypes.DATE
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'nomina',
    timestamps: false,
     indexes: [
      {
        name: 'idx_nomina_empleado', // Nombre del índice
        fields: ['id_empleado']     // Columna indexada
      },
      {
        name: 'idx_nomina_periodo',  // Nombre del índice
        fields: ['mes', 'anio']      // Columnas indexadas (índice compuesto)
      }
    ]

  });

  // Las asociaciones se definen en una función 'associate' que se llamará desde index.js
  Nomina.associate = (models) => {
    Nomina.belongsTo(models.Empleados, {
      foreignKey: 'id_empleado',
      as: 'empleado'
    });

    Nomina.belongsTo(models.Usuarios, {
      foreignKey: 'creado_por',
      as: 'creador'
    });

    Nomina.belongsTo(models.Usuarios, {
      foreignKey: 'actualizado_por',
      as: 'actualizador'
    });
  };

  return Nomina;
};