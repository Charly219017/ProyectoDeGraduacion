const express = require('express');
const router = express.Router();
const { obtenerEstadisticasEmpleados, exportarEmpleadosCSV } = require('../controladores/reporteControlador');
const { autenticarToken } = require('../middlewares/authMiddleware');

// Todas las rutas aquí están protegidas
router.use(autenticarToken);

// @ruta    GET /api/reportes/estadisticas-empleados
router.get('/estadisticas-empleados', obtenerEstadisticasEmpleados);

// @ruta    GET /api/reportes/exportar-empleados
router.get('/exportar-empleados', exportarEmpleadosCSV);

module.exports = router;