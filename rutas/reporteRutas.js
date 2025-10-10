const express = require('express');
const router = express.Router();
const { 
  obtenerEstadisticasEmpleados, 
  exportarEmpleadosCSV,
  obtenerEstadoCandidatos,
  obtenerPromedioDesempeno,
  obtenerTotalSueldosPorMes
} = require('../controladores/reporteControlador');
const { autenticarToken } = require('../middlewares/authMiddleware');

// Todas las rutas aquí están protegidas
router.use(autenticarToken);

// @ruta    GET /api/reportes/estadisticas-empleados
router.get('/estadisticas-empleados', obtenerEstadisticasEmpleados);

// @ruta    GET /api/reportes/exportar-empleados
router.get('/exportar-empleados', exportarEmpleadosCSV);

// @ruta    GET /api/reportes/estado-candidatos
router.get('/estado-candidatos', obtenerEstadoCandidatos);

// @ruta    GET /api/reportes/promedio-desempeno
router.get('/promedio-desempeno', obtenerPromedioDesempeno);

// @ruta    GET /api/reportes/total-sueldos-mes
router.get('/total-sueldos-mes', obtenerTotalSueldosPorMes);

module.exports = router;
