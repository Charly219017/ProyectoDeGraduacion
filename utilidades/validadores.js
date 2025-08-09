// backend/utilidades/validadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de un nuevo usuario.
 * Se asegura de que los campos obligatorios estén presentes y sean válidos.
 */
const validarCreacionUsuario = [
  body('nombre_usuario')
    .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('correo')
    .isEmail().withMessage('El correo electrónico no es válido'),
  body('contrasena')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('id_rol')
    .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero positivo')
];

/**
 * Validaciones para la actualización de un usuario.
 * Permite que los campos sean opcionales, pero si se proporcionan, deben ser válidos.
 */
const validarActualizacionUsuario = [
  body('nombre_usuario')
    .optional()
    .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('correo')
    .optional()
    .isEmail().withMessage('El correo electrónico no es válido'),
  body('contrasena')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('id_rol')
    .optional()
    .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero positivo')
];

module.exports = {
  validarCreacionUsuario,
  validarActualizacionUsuario
};
