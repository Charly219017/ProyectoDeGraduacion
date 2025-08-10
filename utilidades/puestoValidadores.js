// carpeta: backend/utilidades/puestoValidadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de un nuevo puesto.
 */
const validarCreacionPuesto = [
    body('nombre_puesto')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del puesto debe tener entre 2 y 100 caracteres'),
    body('salario')
        .isFloat({ gt: 0 }).withMessage('El salario debe ser un número positivo'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('id_departamento')
        .isInt({ gt: 0 }).withMessage('El ID del departamento debe ser un número entero positivo')
];

/**
 * Validaciones para la actualización de un puesto.
 */
const validarActualizacionPuesto = [
    body('nombre_puesto')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre del puesto debe tener entre 2 y 100 caracteres'),
    body('salario')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El salario debe ser un número positivo'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('id_departamento')
        .optional()
        .isInt({ gt: 0 }).withMessage('El ID del departamento debe ser un número entero positivo')
];

module.exports = {
    validarCreacionPuesto,
    validarActualizacionPuesto
};
