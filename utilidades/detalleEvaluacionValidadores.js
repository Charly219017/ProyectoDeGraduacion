// carpeta: backend/utilidades/detalleEvaluacionValidadores.js
const { body } = require('express-validator');

const validarCreacionDetalleEvaluacion = [
    body('id_evaluacion')
        .isInt({ gt: 0 }).withMessage('El ID de la evaluación debe ser un número entero positivo'),
    body('id_criterio')
        .isInt({ gt: 0 }).withMessage('El ID del criterio debe ser un número entero positivo'),
    body('puntuacion')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('La puntuación debe ser un número decimal')
];

const validarActualizacionDetalleEvaluacion = [
    body('id_evaluacion')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de la evaluación debe ser un número entero positivo'),
    body('id_criterio')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del criterio debe ser un número entero positivo'),
    body('puntuacion')
        .optional()
        .isDecimal().withMessage('La puntuación debe ser un número decimal')
];

module.exports = {
    validarCreacionDetalleEvaluacion,
    validarActualizacionDetalleEvaluacion
};
