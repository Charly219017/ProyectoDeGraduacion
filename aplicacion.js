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
const contratoRutas = require('./rutas/contratoRutas');
const bienestarRutas = require('./rutas/bienestarRutas');
const dependenciaRutas = require('./rutas/dependenciaRutas');
const vacanteRutas = require('./rutas/vacanteRutas');
const candidatoRutas = require('./rutas/candidatoRutas');
const aplicacionRutas = require('./rutas/aplicacionRutas');
const criterioRutas = require('./rutas/criterioRutas');
const evaluacionRutas = require('./rutas/evaluacionRutas');
const detalleEvaluacionRutas = require('./rutas/detalleEvaluacionRutas');
const nominaRutas = require('./rutas/nominaRutas');
const vacacionRutas = require('./rutas/vacacionRutas');

// Crear aplicación Express
const app = express();

// --- Middlewares de seguridad, configuración y logs ---
app.use(helmet(/* ... */));
app.use(cors(/* ... */));
app.use(morgan(/* ... */));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/static', express.static(path.join(__dirname, 'public')));

// --- Rutas de la API ---
app.get('/api/health', (req, res) => { /* ... */ });
app.get('/api', (req, res) => { /* ... */ });

// Configurar rutas de la API
app.use('/api/auth', authRutas);
app.use('/api/dashboard', dashboardRutas);
app.use('/api/mantenimiento', mantenimientoRutas);
app.use('/api/empleados', empleadoRutas);
app.use('/api/carreras', carreraRutas);
app.use('/api/puestos', puestoRutas);
app.use('/api/contratos', contratoRutas);
app.use('/api/bienestar', bienestarRutas);
app.use('/api/dependencias', dependenciaRutas);
app.use('/api/vacantes', vacanteRutas);
app.use('/api/candidatos', candidatoRutas);
app.use('/api/aplicaciones', aplicacionRutas);
app.use('/api/criterios', criterioRutas);
app.use('/api/evaluaciones', evaluacionRutas);
app.use('/api/detalles_evaluacion', detalleEvaluacionRutas);
app.use('/api/nominas', nominaRutas);
app.use('/api/vacaciones', vacacionRutas);

// --- Manejo de errores y rutas no encontradas ---
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// --- Función para iniciar el servidor ---
const iniciarServidor = async () => { /* ... */ };

// ... resto del archivo ...

module.exports = app;