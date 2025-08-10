// carpeta: backend/utilidades/carreraValidadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de una nueva carrera.
 */
const validarCreacionCarrera = [
    body('nombre_carrera')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la carrera debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto')
];

/**
 * Validaciones para la actualización de una carrera.
 */
const validarActualizacionCarrera = [
    body('nombre_carrera')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la carrera debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto')
];

module.exports = {
    validarCreacionCarrera,
    validarActualizacionCarrera
};
