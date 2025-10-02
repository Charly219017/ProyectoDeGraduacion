// carpeta: backend/rutas/nominaRutas.js
const express = require('express');
const nominaControlador = require('../controladores/nominaControlador');
const { validarCreacionNomina, validarActualizacionNomina } = require('../utilidades/nominaValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de nómina
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Nómina
router.get('/obtenernominas', nominaControlador.obtenerTodasNominas);
router.post('/crearnomina', validarCreacionNomina, nominaControlador.crearNomina);
router.get('/:id_nomina', nominaControlador.obtenerNominaPorId);
router.put('/:id_nomina', validarActualizacionNomina, nominaControlador.actualizarNomina);
router.delete('/:id_nomina', nominaControlador.eliminarNomina);

module.exports = router;
