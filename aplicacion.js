// backend/aplicacion.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Importar utilidades y configuración
const logger = require('./utilidades/logger');
const { probarConexion } = require('./modelos/index');

// Importar middlewares de manejo de errores (unificados)
const {
  manejarErrores,
  rutaNoEncontrada
} = require('./middlewares/errorMiddleware');

// Importar rutas
const authRutas = require('./rutas/authRutas');
const dashboardRutas = require('./rutas/dashboardRutas');
const mantenimientoRutas = require('./rutas/mantenimientoRutas'); 
const empleadoRutas = require('./rutas/empleadoRutas');
const carreraRutas = require('./rutas/carreraRutas');
const puestoRutas = require('./rutas/puestoRutas');

// Crear aplicación Express
const app = express();

// --- Middlewares de seguridad, configuración y logs ---
// Configuración de seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de Morgan para logs de peticiones HTTP
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para servir archivos estáticos (si es necesario)
app.use('/static', express.static(path.join(__dirname, 'public')));

// --- Rutas de la API ---
// Ruta de prueba de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    mensaje: 'Sistema Jireh funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de bienvenida para el punto de entrada de la API
app.get('/api', (req, res) => {
  res.status(200).json({ mensaje: '¡Bienvenido a la API del sistema Jireh! La API está funcionando.' });
});

// Configurar rutas de la API
app.use('/api/auth', authRutas);
app.use('/api/dashboard', dashboardRutas);
app.use('/api/mantenimiento', mantenimientoRutas); 
app.use('/api/empleados', empleadoRutas);
app.use('/api/carreras', carreraRutas);
app.use('/api/puestos', puestoRutas);

// --- Manejo de errores y rutas no encontradas ---
// Middleware para manejar rutas no encontradas (debe ir después de todas las rutas)
app.use(rutaNoEncontrada);

// Middleware para manejar todos los errores (debe ser el último)
app.use(manejarErrores);

// --- Función para iniciar el servidor ---
const iniciarServidor = async () => {
  try {
    // Probar conexión a la base de datos
    await probarConexion();
    
    // Obtener puerto del entorno
    const puerto = process.env.PORT || 3000;
    
    // Iniciar servidor
    app.listen(puerto, () => {
      logger.info(`Servidor iniciado en puerto ${puerto}`);
      logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`URL del servidor: http://localhost:${puerto}`);
      logger.info(`URL de la API: http://localhost:${puerto}/api`);
    });

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejar señales de terminación y errores no capturados
process.on('SIGTERM', () => {
  logger.info('Señal SIGTERM recibida, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Señal SIGINT recibida, cerrando servidor...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar servidor si este archivo se ejecuta directamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = app;
