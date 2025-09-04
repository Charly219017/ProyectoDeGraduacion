// carpeta backend/modelos/roles.js
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'roles', // Nombre de la tabla de la base de datos
    timestamps: false
  });

  return Roles;
};