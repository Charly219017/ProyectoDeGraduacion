// carpeta: backend/rutas/productoRutas.js
const express = require('express');
const productoControlador = require('../controladores/productoControlador');
const { validarCreacionProducto, validarActualizacionProducto } = require('../utilidades/productoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/obtenerproductos', autenticarToken, soloAdministradores, productoControlador.obtenerTodosProductos);
router.post('/crearproducto', autenticarToken, soloAdministradores, validarCreacionProducto, productoControlador.crearProducto);
router.get('/obtener/:id_producto', autenticarToken, soloAdministradores, productoControlador.obtenerProductoPorId);
router.put('/actualizar/:id_producto', autenticarToken, soloAdministradores, validarActualizacionProducto, productoControlador.actualizarProducto);
router.delete('/eliminar/:id_producto', autenticarToken, soloAdministradores, productoControlador.eliminarProducto);

module.exports = router;
