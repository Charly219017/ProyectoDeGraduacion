// carpeta: backend/utilidades/evaluacionValidadores.js
const { body } = require('express-validator');

const validarCreacionEvaluacion = [
    body('id_empleado')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('fecha_evaluacion')
        .isISO8601().toDate().withMessage('La fecha de evaluación debe ser una fecha válida'),
    body('evaluador')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 }).withMessage('El nombre del evaluador no puede exceder los 100 caracteres'),
    body('comentarios')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('Los comentarios deben ser una cadena de texto'),
    body('puntuacion_total')
        .optional({ nullable: true, checkFalsy: true })
        .isDecimal().withMessage('La puntuación total debe ser un número decimal')
];

const validarActualizacionEvaluacion = [
    body('id_empleado')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo'),
    body('fecha_evaluacion')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de evaluación debe ser una fecha válida'),
    body('evaluador')
        .optional()
        .isLength({ max: 100 }).withMessage('El nombre del evaluador no puede exceder los 100 caracteres'),
    body('comentarios')
        .optional()
        .isString().withMessage('Los comentarios deben ser una cadena de texto'),
    body('puntuacion_total')
        .optional()
        .isDecimal().withMessage('La puntuación total debe ser un número decimal')
];

module.exports = {
    validarCreacionEvaluacion,
    validarActualizacionEvaluacion
};
