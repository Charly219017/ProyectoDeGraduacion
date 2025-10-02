// carpeta: backend/rutas/aplicacionRutas.js
const express = require('express');
const aplicacionControlador = require('../controladores/aplicacionControlador');
const { validarCreacionAplicacion, validarActualizacionAplicacion } = require('../utilidades/aplicacionValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de aplicaciones
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Aplicaciones
router.get('/obtener-aplicaciones', aplicacionControlador.obtenerTodasAplicaciones);
router.post('/crearaplicacion', validarCreacionAplicacion, aplicacionControlador.crearAplicacion);
router.get('/obtener/:id_aplicacion', aplicacionControlador.obtenerAplicacionPorId);
router.put('/actualizar/:id_aplicacion', validarActualizacionAplicacion, aplicacionControlador.actualizarAplicacion);
router.delete('/eliminar/:id_aplicacion', aplicacionControlador.eliminarAplicacion);

module.exports = router;
