// carpeta: backend/rutas/vacacionRutas.js
const express = require('express');
const vacacionControlador = require('../controladores/vacacionControlador');
const { validarCreacionVacacion, validarActualizacionVacacion } = require('../utilidades/vacacionValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de vacaciones
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Vacaciones
router.get('/obtenervacaciones', vacacionControlador.obtenerTodasVacaciones);
router.post('/crearvacacion', validarCreacionVacacion, vacacionControlador.crearVacacion);
router.get('/:id_vacacion', vacacionControlador.obtenerVacacionPorId);
router.put('/:id_vacacion', validarActualizacionVacacion, vacacionControlador.actualizarVacacion);
router.delete('/:id_vacacion', vacacionControlador.eliminarVacacion);

module.exports = router;
