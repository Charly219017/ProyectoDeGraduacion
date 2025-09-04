// carpeta: backend/rutas/dependenciaRutas.js
const express = require('express');
const dependenciaControlador = require('../controladores/dependenciaControlador');
const { validarCreacionDependencia, validarActualizacionDependencia } = require('../utilidades/dependenciaValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de dependencias
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Dependencias
router.get('/', dependenciaControlador.obtenerTodasDependencias);
router.post('/', validarCreacionDependencia, dependenciaControlador.crearDependencia);
router.get('/:id_dependencia', dependenciaControlador.obtenerDependenciaPorId);
router.put('/:id_dependencia', validarActualizacionDependencia, dependenciaControlador.actualizarDependencia);
router.delete('/:id_dependencia', dependenciaControlador.eliminarDependencia);

module.exports = router;
