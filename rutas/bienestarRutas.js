// carpeta: backend/rutas/bienestarRutas.js
const express = require('express');
const bienestarControlador = require('../controladores/bienestarControlador');
const { validarCreacionActividadBienestar, validarActualizacionActividadBienestar } = require('../utilidades/bienestarValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de bienestar
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Bienestar
router.get('/obtenertodo-bienestar', bienestarControlador.obtenerTodasActividadesBienestar);
router.post('/crearbienestar', validarCreacionActividadBienestar, bienestarControlador.crearActividadBienestar);
router.get('/obtener/:id_bienestar', bienestarControlador.obtenerActividadBienestarPorId);
router.put('/actualizar/:id_bienestar', validarActualizacionActividadBienestar, bienestarControlador.actualizarActividadBienestar);
router.delete('/eliminar/:id_bienestar', bienestarControlador.eliminarActividadBienestar);

module.exports = router;
