// carpeta: backend/rutas/candidatoRutas.js
const express = require('express');
const candidatoControlador = require('../controladores/candidatoControlador');
const { validarCreacionCandidato, validarActualizacionCandidato } = require('../utilidades/candidatoValidadores');
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware de autenticación y autorización para todas las rutas de candidatos
router.use(autenticarToken);
router.use(soloAdministradores);

// Rutas para Candidatos
router.get('/obtenercandidatos', candidatoControlador.obtenerTodosCandidatos);
router.post('/crearcandidato', validarCreacionCandidato, candidatoControlador.crearCandidato);
router.get('/obtener/:id_candidato', candidatoControlador.obtenerCandidatoPorId);
router.put('/actualizar/:id_candidato', validarActualizacionCandidato, candidatoControlador.actualizarCandidato);
router.delete('/eliminar/:id_candidato', candidatoControlador.eliminarCandidato);

module.exports = router;
