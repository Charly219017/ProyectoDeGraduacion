// carpeta: backend/rutas/criterioRutas.js
const express = require('express');
const criterioControlador = require('../controladores/criterioControlador');
const { validarCreacionCriterio, validarActualizacionCriterio } = require('../utilidades/criterioValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de criterios
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Criterios
router.get('/', criterioControlador.obtenerTodosCriterios);
router.post('/', validarCreacionCriterio, criterioControlador.crearCriterio);
router.get('/:id_criterio', criterioControlador.obtenerCriterioPorId);
router.put('/:id_criterio', validarActualizacionCriterio, criterioControlador.actualizarCriterio);
router.delete('/:id_criterio', criterioControlador.eliminarCriterio);

module.exports = router;
