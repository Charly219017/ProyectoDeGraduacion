// carpeta: backend/utilidades/puestoValidadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de un nuevo puesto.
 */
const validarCreacionPuesto = [
    body('nombre_puesto')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del puesto debe tener entre 2 y 100 caracteres')
        .notEmpty().withMessage('El nombre del puesto es requerido'),
    body('salario_base')
        .isFloat({ gt: 0 }).withMessage('El salario base debe ser un número positivo')
        .notEmpty().withMessage('El salario base es requerido'),
    body('id_carrera')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de la carrera debe ser un número entero positivo')
];

/**
 * Validaciones para la actualización de un puesto.
 */
const validarActualizacionPuesto = [
    body('nombre_puesto')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del puesto debe tener entre 2 y 100 caracteres'),
    body('salario_base')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El salario base debe ser un número positivo'),
    body('id_carrera')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID de la carrera debe ser un número entero positivo')
];

module.exports = {
    validarCreacionPuesto,
    validarActualizacionPuesto
};
