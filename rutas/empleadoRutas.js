// carpeta: backend/rutas/empleadoRutas.js
const express = require('express');
const empleadoControlador = require('../controladores/empleadoControlador');
const { validarCreacionEmpleado, validarActualizacionEmpleado } = require('../utilidades/empleadoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de empleados requieren autenticación y permisos de administrador
router.use(autenticarToken);
router.use(soloAdministradores);

// Ruta para obtener todos los empleados
router.get('/', empleadoControlador.obtenerTodosEmpleados);

// Ruta para crear un nuevo empleado
router.post('/', validarCreacionEmpleado, empleadoControlador.crearEmpleado);

// Ruta para obtener un empleado por su ID
router.get('/:id_empleado', empleadoControlador.obtenerEmpleadoPorId);

// Ruta para actualizar un empleado por su ID
router.put('/:id_empleado', validarActualizacionEmpleado, empleadoControlador.actualizarEmpleado);

// Ruta para eliminar un empleado por su ID
router.delete('/:id_empleado', empleadoControlador.eliminarEmpleado);

module.exports = router;
