// carpeta: backend/utilidades/candidatoValidadores.js
const { body } = require('express-validator');

const validarCreacionCandidato = [
    body('nombre_completo')
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('correo')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo no es válido'),
    body('telefono')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('cv_url')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('La URL del CV no es válida')
];

const validarActualizacionCandidato = [
    body('nombre_completo')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('correo')
        .optional()
        .isEmail().withMessage('El correo no es válido'),
    body('telefono')
        .optional()
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('cv_url')
        .optional()
        .isURL().withMessage('La URL del CV no es válida')
];

module.exports = {
    validarCreacionCandidato,
    validarActualizacionCandidato
};
