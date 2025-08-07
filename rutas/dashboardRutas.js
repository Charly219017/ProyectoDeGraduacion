//carpeta backend/rutas/dashboardRutas.js
const express = require('express');
const { obtenerEstadisticas, obtenerResumen } = require('../controladores/dashboardControlador');
const { autenticarToken, empleadosYAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas del dashboard
router.use(autenticarToken);

// Ruta para obtener estadísticas del dashboard
router.get('/estadisticas', empleadosYAdmin, obtenerEstadisticas);

// Ruta para obtener resumen del sistema
router.get('/resumen', empleadosYAdmin, obtenerResumen);

module.exports = router; 