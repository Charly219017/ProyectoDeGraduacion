// carpeta Backend/modelos/usuarios.js
module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('Usuarios', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50]
      }
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    contrasena_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actualizado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'usuarios', // Nombre de la tabla de la base de datos
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
  });

  // Aquí definimos las relaciones de la tabla Usuarios
  Usuarios.associate = (models) => {
    // Un usuario pertenece a un rol
    Usuarios.belongsTo(models.Roles, { 
      foreignKey: 'id_rol', 
      as: 'roles' 
    });

    // Un usuario fue creado por otro usuario
    Usuarios.belongsTo(models.Usuarios, { 
      foreignKey: 'creado_por', 
      as: 'creador' 
    });

    // Un usuario fue actualizado por otro usuario
    Usuarios.belongsTo(models.Usuarios, { 
      foreignKey: 'actualizado_por', 
      as: 'actualizador' 
    });
  };

  return Usuarios;
};