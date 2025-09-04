// carpeta: backend/rutas/evaluacionRutas.js
const express = require('express');
const evaluacionControlador = require('../controladores/evaluacionControlador');
const { validarCreacionEvaluacion, validarActualizacionEvaluacion } = require('../utilidades/evaluacionValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de evaluaciones
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Evaluaciones
router.get('/', evaluacionControlador.obtenerTodasEvaluaciones);
router.post('/', validarCreacionEvaluacion, evaluacionControlador.crearEvaluacion);
router.get('/:id_evaluacion', evaluacionControlador.obtenerEvaluacionPorId);
router.put('/:id_evaluacion', validarActualizacionEvaluacion, evaluacionControlador.actualizarEvaluacion);
router.delete('/:id_evaluacion', evaluacionControlador.eliminarEvaluacion);

module.exports = router;
