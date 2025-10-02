// backend/rutas/mantenimientoRutas.js
const express = require('express');
const router = express.Router();
const mantenimientoControlador = require('../controladores/mantenimientoControlador');
const { validarCreacionUsuario, validarActualizacionUsuario } = require('../utilidades/validadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

// Ruta para obtener todos los usuarios (solo para administradores)
router.get('/obtebertodoslosmantenimientos/usuarios', autenticarToken, soloAdministradores, mantenimientoControlador.obtenerTodosUsuarios);

// Ruta para crear un nuevo usuario (solo para administradores)
router.post('/crearmantenimiento/usuarios', autenticarToken, soloAdministradores, validarCreacionUsuario, mantenimientoControlador.crearUsuario);

// Ruta para actualizar un usuario por su ID (solo para administradores)
router.put('/usuarios/:id_usuario', autenticarToken, soloAdministradores, validarActualizacionUsuario, mantenimientoControlador.actualizarUsuario);

// Ruta para eliminar un usuario por su ID (solo para administradores)
router.delete('/usuarios/:id_usuario', autenticarToken, soloAdministradores, mantenimientoControlador.eliminarUsuario);

// Ruta para obtener los registros de auditoría (solo para administradores)
router.get('/auditoria', autenticarToken, soloAdministradores, mantenimientoControlador.obtenerAuditoria);

module.exports = router;
