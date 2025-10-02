// carpeta: backend/rutas/puestoRutas.js
const express = require('express');
const puestoControlador = require('../controladores/puestoControlador');
const { validarCreacionPuesto, validarActualizacionPuesto } = require('../utilidades/puestoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas de puestos requieren autenticación y permisos de administrador
router.use(autenticarToken);
router.use(soloAdministradores);

// Ruta para obtener todos los puestos
router.get('/obtenerpuestos', puestoControlador.obtenerTodosPuestos);

// Ruta para crear un nuevo puesto
router.post('/crearpuesto', validarCreacionPuesto, puestoControlador.crearPuesto);

// Ruta para obtener un puesto por su ID
router.get('/:id_puesto', puestoControlador.obtenerPuestoPorId);

// Ruta para actualizar un puesto por su ID
router.put('/:id_puesto', validarActualizacionPuesto, puestoControlador.actualizarPuesto);

// Ruta para eliminar un puesto por su ID
router.delete('/:id_puesto', puestoControlador.eliminarPuesto);

module.exports = router;
