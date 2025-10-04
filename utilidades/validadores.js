// backend/utilidades/validadores.js
const { body } = require('express-validator');
const { Usuarios } = require('../modelos');

/**
 * Validaciones para la creación de un nuevo usuario.
 * Se asegura de que los campos obligatorios estén presentes y sean válidos.
 */
const validarCreacionUsuario = [
  body('nombre_usuario')
    .isLength({ min: 6 }).withMessage('El nombre de usuario debe tener al menos 6 caracteres'),
  // Validación de unicidad para nombre_usuario
  body('nombre_usuario').custom(async (value) => {
    const usuario = await Usuarios.findOne({ where: { nombre_usuario: value } });
    if (usuario) {
      return Promise.reject('El nombre de usuario ya está en uso');
    }
  }),
  body('correo')
    .isEmail().withMessage('El correo electrónico no es válido')
    .custom(async (value) => {
      const usuario = await Usuarios.findOne({ where: { correo: value } });
      if (usuario) {
        return Promise.reject('El correo electrónico ya está registrado');
      }
    }),
  body('contrasena')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
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
    .isLength({ min: 6 }).withMessage('El nombre de usuario debe tener al menos 6 caracteres'),
  body('correo')
    .optional()
    .isEmail().withMessage('El correo electrónico no es válido')
    .custom(async (value, { req }) => {
      const usuario = await Usuarios.findOne({ where: { correo: value } });
      // Si el correo existe y no pertenece al usuario que se está actualizando, rechazar.
      if (usuario && usuario.id_usuario !== parseInt(req.params.id_usuario, 10)) {
        return Promise.reject('El correo electrónico ya está registrado por otro usuario');
      }
    }),
  body('contrasena')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('id_rol')
    .optional()
    .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero positivo'),
  body('activo')
    .optional()
    .isBoolean().withMessage('El estado del usuario debe ser un valor booleano')
];

module.exports = {
  validarCreacionUsuario,
  validarActualizacionUsuario
};