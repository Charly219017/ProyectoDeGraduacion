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
router.get('/obtener-todos', contratoControlador.obtenerTodosContratos);
router.post('/crear', validarCreacionContrato, contratoControlador.crearContrato);
router.get('/obtener/:id_contrato', contratoControlador.obtenerContratoPorId);
router.put('/actualizar/:id_contrato', validarActualizacionContrato, contratoControlador.actualizarContrato);
router.delete('/eliminar/:id_contrato', contratoControlador.eliminarContrato);

module.exports = router;
