// carpeta: backend/utilidades/candidatoValidadores.js
const { body } = require('express-validator');

const validarCreacionCandidato = [
    body('nombre_completo')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('correo')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo no es válido')
        .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),
    body('telefono')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres')
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('cv_url')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('La URL del CV no es válida'),
    body('fecha_aplicacion')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de aplicación debe ser una fecha válida')
];

const validarActualizacionCandidato = [
    body('nombre_completo')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('correo')
        .optional()
        .isEmail().withMessage('El correo no es válido')
        .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres'),
    body('telefono')
        .optional()
        .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres')
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('cv_url')
        .optional()
        .isURL().withMessage('La URL del CV no es válida'),
    body('fecha_aplicacion')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de aplicación debe ser una fecha válida')
];

module.exports = {
    validarCreacionCandidato,
    validarActualizacionCandidato
};
