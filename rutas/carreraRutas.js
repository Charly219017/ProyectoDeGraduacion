// carpeta: backend/rutas/carreraRutas.js
const express = require('express');
const carreraControlador = require('../controladores/carreraControlador');
const { validarCreacionCarrera, validarActualizacionCarrera } = require('../utilidades/carreraValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de carreras requieren autenticación y permisos de administrador
router.use(autenticarToken);
router.use(soloAdministradores);

// Ruta para obtener todas las carreras
router.get('/obtener-todas', carreraControlador.obtenerTodasCarreras);

// Ruta para crear una nueva carrera
router.post('/crear', validarCreacionCarrera, carreraControlador.crearCarrera);

// Ruta para obtener una carrera por su ID
router.get('/obtener/:id_carrera', carreraControlador.obtenerCarreraPorId);

// Ruta para actualizar una carrera por su ID
router.put('/actualizar/:id_carrera', validarActualizacionCarrera, carreraControlador.actualizarCarrera);

// Ruta para eliminar una carrera por su ID
router.delete('/eliminar/:id_carrera', carreraControlador.eliminarCarrera);

module.exports = router;
