// carpeta: backend/rutas/movimientoInventarioRutas.js
const express = require('express');
const movimientoInventarioControlador = require('../controladores/movimientoInventarioControlador');
const { validarCreacionMovimiento } = require('../utilidades/movimientoInventarioValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/obtenermovimientos', autenticarToken, soloAdministradores, movimientoInventarioControlador.obtenerTodosMovimientos);
router.post('/crearmovimiento', autenticarToken, soloAdministradores, validarCreacionMovimiento, movimientoInventarioControlador.crearMovimiento);
router.get('/obtener/:id_movimiento', autenticarToken, soloAdministradores, movimientoInventarioControlador.obtenerMovimientoPorId);

module.exports = router;
