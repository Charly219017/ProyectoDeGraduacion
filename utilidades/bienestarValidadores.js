// carpeta: backend/utilidades/bienestarValidadores.js
const { body } = require('express-validator');

const validarCreacionActividadBienestar = [
    body('nombre_actividad')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la actividad debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_actividad')
        .isISO8601().toDate().withMessage('La fecha de la actividad debe ser una fecha válida')
];

const validarActualizacionActividadBienestar = [
    body('nombre_actividad')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre de la actividad debe tener entre 2 y 100 caracteres'),
    body('descripcion')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('fecha_actividad')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de la actividad debe ser una fecha válida')
];

module.exports = {
    validarCreacionActividadBienestar,
    validarActualizacionActividadBienestar
};
