// carpeta backend/modelos/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize'); // <-- Importación de DataTypes agregada
const config = require('../configuracion/configuracion');
const logger = require('../utilidades/logger');
const auditHooks = require('../utilidades/auditHook');

// Configuración del entorno
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crear instancia de Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ? console.log : false,
    pool: dbConfig.pool,
    define: {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  }
);

const db = {};

// Cargar todos los modelos de la carpeta
const modelsPath = __dirname;
fs.readdirSync(modelsPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // La función require ahora pasa la instancia de sequelize y DataTypes
    const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Aplicar hooks de auditoría a todos los modelos excepto Auditoria
Object.values(sequelize.models).forEach(model => {
  if (model.name !== 'Auditoria') { // Prevenir bucles infinitos
    for (const hookName in auditHooks) {
      model.addHook(hookName, auditHooks[hookName]);
    }
  }
});

// Función para probar la conexión
const probarConexion = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    logger.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

// Función para sincronizar modelos
const sincronizarModelos = async (force = false) => {
  try {
    await sequelize.sync({ force });
    logger.info('Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('Error al sincronizar modelos:', error);
    throw error;
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.probarConexion = probarConexion;
db.sincronizarModelos = sincronizarModelos;

module.exports = db;
