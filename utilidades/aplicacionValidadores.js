// carpeta: backend/utilidades/aplicacionValidadores.js
const { body } = require('express-validator');

const validarCreacionAplicacion = [
    body('id_vacante')
        .isInt({ gt: 0 }).withMessage('El ID de la vacante debe ser un número entero positivo'),
    body('id_candidato')
        .isInt({ gt: 0 }).withMessage('El ID del candidato debe ser un número entero positivo'),
    body('estado_aplicacion')
        .optional()
        .isIn(['En revisión', 'Entrevista', 'Rechazado', 'Contratado']).withMessage('Estado de aplicación no válido')
];

const validarActualizacionAplicacion = [
    body('id_vacante')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de la vacante debe ser un número entero positivo'),
    body('id_candidato')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del candidato debe ser un número entero positivo'),
    body('estado_aplicacion')
        .optional()
        .isIn(['En revisión', 'Entrevista', 'Rechazado', 'Contratado']).withMessage('Estado de aplicación no válido')
];

module.exports = {
    validarCreacionAplicacion,
    validarActualizacionAplicacion
};
