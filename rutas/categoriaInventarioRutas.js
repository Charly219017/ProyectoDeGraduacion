// carpeta: backend/rutas/categoriaInventarioRutas.js
const express = require('express');
const categoriaInventarioControlador = require('../controladores/categoriaInventarioControlador');
const { validarCreacionCategoria, validarActualizacionCategoria } = require('../utilidades/categoriaInventarioValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/obtenercategorias', autenticarToken, soloAdministradores, categoriaInventarioControlador.obtenerTodasCategorias);
router.post('/crearcategoria', autenticarToken, soloAdministradores, validarCreacionCategoria, categoriaInventarioControlador.crearCategoria);
router.get('/obtener/:id_categoria', autenticarToken, soloAdministradores, categoriaInventarioControlador.obtenerCategoriaPorId);
router.put('/actualizar/:id_categoria', autenticarToken, soloAdministradores, validarActualizacionCategoria, categoriaInventarioControlador.actualizarCategoria);
router.delete('/eliminar/:id_categoria', autenticarToken, soloAdministradores, categoriaInventarioControlador.eliminarCategoria);

module.exports = router;
