// carpeta: backend/rutas/detalleEvaluacionRutas.js
const express = require('express');
const detalleEvaluacionControlador = require('../controladores/detalleEvaluacionControlador');
const { validarCreacionDetalleEvaluacion, validarActualizacionDetalleEvaluacion } = require('../utilidades/detalleEvaluacionValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de detalles de evaluación
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Detalles de Evaluación
router.get('/', detalleEvaluacionControlador.obtenerTodosDetallesEvaluacion);
router.post('/', validarCreacionDetalleEvaluacion, detalleEvaluacionControlador.crearDetalleEvaluacion);
router.get('/:id_detalle', detalleEvaluacionControlador.obtenerDetalleEvaluacionPorId);
router.put('/:id_detalle', validarActualizacionDetalleEvaluacion, detalleEvaluacionControlador.actualizarDetalleEvaluacion);
router.delete('/:id_detalle', detalleEvaluacionControlador.eliminarDetalleEvaluacion);

module.exports = router;
