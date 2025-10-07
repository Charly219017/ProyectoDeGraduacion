// carpeta: backend/rutas/empleadoRutas.js
const express = require('express');
const empleadoControlador = require('../controladores/empleadoControlador');
const { validarCreacionEmpleado, validarActualizacionEmpleado } = require('../utilidades/empleadoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los empleados
router.get('/obtenerempleados', autenticarToken, soloAdministradores, empleadoControlador.obtenerTodosEmpleados);

// Ruta para crear un nuevo empleado
router.post('/crearempleado', autenticarToken, soloAdministradores, validarCreacionEmpleado, empleadoControlador.crearEmpleado);

// Ruta para obtener un empleado por su ID
router.get('/obtener/:id_empleado', autenticarToken, soloAdministradores, empleadoControlador.obtenerEmpleadoPorId);

// Ruta para actualizar un empleado por su ID
router.put('/actualizar/:id_empleado', autenticarToken, soloAdministradores, validarActualizacionEmpleado, empleadoControlador.actualizarEmpleado);

// Ruta para eliminar un empleado por su ID
router.delete('/eliminar/:id_empleado', autenticarToken, soloAdministradores, empleadoControlador.eliminarEmpleado);

module.exports = router;
