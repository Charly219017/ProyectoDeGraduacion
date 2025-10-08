// carpeta: backend/utilidades/detalleEvaluacionValidadores.js
const { body } = require('express-validator');

const validarCreacionDetalleEvaluacion = [
    body('id_evaluacion')
        .notEmpty().withMessage('El ID de la evaluación es requerido')
        .isInt({ gt: 0 }).withMessage('El ID de la evaluación debe ser un número entero positivo'),
    body('id_criterio')
        .notEmpty().withMessage('El ID del criterio es requerido')
        .isInt({ gt: 0 }).withMessage('El ID del criterio debe ser un número entero positivo'),
    body('puntuacion')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('La puntuación debe ser un número decimal')
        .isFloat({ min: 0, max: 100 }).withMessage('La puntuación debe estar entre 0 y 100')
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
        .isFloat({ min: 0, max: 100 }).withMessage('La puntuación debe estar entre 0 y 100')
];

module.exports = {
    validarCreacionDetalleEvaluacion,
    validarActualizacionDetalleEvaluacion
};
