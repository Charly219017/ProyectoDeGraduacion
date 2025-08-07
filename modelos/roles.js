// carpeta backend/modelos/roles.js
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('Roles', {
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
/*
  // Definimos la relación inversa: un rol tiene muchos usuarios
  Rol.associate = (models) => {
    Rol.hasMany(models.Usuarios, {
      foreignKey: 'id_rol',
      as: 'usuarios'
    });
  };
  */

  return Rol;
};