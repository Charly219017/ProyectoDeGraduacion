// backend/rutas/authRutas.js

const express = require('express');
const { body } = require('express-validator');

// Importación de las funciones del controlador.
// Usamos el nombre 'perfil' que es el que se usa en authControlador.js
const { login, registro, perfil } = require('../controladores/authControlador');

// Asegúrate de que estos middlewares estén definidos en sus respectivos archivos
const { autenticarToken, soloAdministradores } = require('../middlewares/authMiddleware');

const router = express.Router();

// Validaciones para login
const validacionesLogin = [
  body('nombre_usuario')
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 6 y 50 caracteres'),
  body('contrasena')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Validaciones para registro
const validacionesRegistro = [
  body('nombre_usuario')
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El nombre de usuario solo puede contener letras, números y guiones bajos'),
  body('correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo electrónico no es válido'),
  body('contrasena')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  body('nombre_rol')
    .optional()
    .isIn(['Administrador', 'Empleado', 'Externo'])
    .withMessage('El rol debe ser Administrador, Empleado o Externo')
];

// Ruta para login
router.post('/login', validacionesLogin, login);

// Ruta para registro (solo administradores)
router.post('/registro', 
  autenticarToken, 
  soloAdministradores, 
  validacionesRegistro, 
  registro
);

// Ruta para obtener perfil del usuario actual
router.get('/perfil', autenticarToken, perfil);

// Ruta para obtener perfil del usuario actual
router.get('/perfil', autenticarToken, perfil);

module.exports = router;