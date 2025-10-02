// carpeta: backend/rutas/vacanteRutas.js
const express = require('express');
const vacanteControlador = require('../controladores/vacanteControlador');
const { validarCreacionVacante, validarActualizacionVacante } = require('../utilidades/vacanteValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de vacantes
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Vacantes
router.get('/obtenervacantes', vacanteControlador.obtenerTodasVacantes);
router.post('/crearvacantes', validarCreacionVacante, vacanteControlador.crearVacante);
router.get('/:id_vacante', vacanteControlador.obtenerVacantePorId);
router.put('/:id_vacante', validarActualizacionVacante, vacanteControlador.actualizarVacante);
router.delete('/:id_vacante', vacanteControlador.eliminarVacante);

module.exports = router;
