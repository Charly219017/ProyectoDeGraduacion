// carpeta: backend/rutas/contratoRutas.js
const express = require('express');
const contratoControlador = require('../controladores/contratoControlador');
const { validarCreacionContrato, validarActualizacionContrato } = require('../utilidades/contratoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de contratos
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Contratos
router.get('/', contratoControlador.obtenerTodosContratos);
router.post('/', validarCreacionContrato, contratoControlador.crearContrato);
router.get('/:id_contrato', contratoControlador.obtenerContratoPorId);
router.put('/:id_contrato', validarActualizacionContrato, contratoControlador.actualizarContrato);
router.delete('/:id_contrato', contratoControlador.eliminarContrato);

module.exports = router;
