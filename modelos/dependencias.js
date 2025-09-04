// backend/modelos/dependencias.js
module.exports = (sequelize, DataTypes) => {
  const Dependencias = sequelize.define('Dependencias', {
    id_dependencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_puesto_superior: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Puestos',
        key: 'id_puesto'
      }
    },
    id_puesto_subordinado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      references: {
        model: 'Puestos',
        key: 'id_puesto'
      }
    }
  }, {
    tableName: 'dependencias',
    timestamps: false,
  });

  Dependencias.associate = (models) => {
    Dependencias.belongsTo(models.Puestos, {
      foreignKey: 'id_puesto_superior',
      as: 'puesto_superior'
    });
    Dependencias.belongsTo(models.Puestos, {
      foreignKey: 'id_puesto_subordinado',
      as: 'puesto_subordinado'
    });
  };

  return Dependencias;
};
