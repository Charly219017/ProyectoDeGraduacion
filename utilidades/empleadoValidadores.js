// carpeta: backend/utilidades/empleadoValidadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de un nuevo empleado.
 */
const validarCreacionEmpleado = [
    body('nombre_completo')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres')
        .notEmpty().withMessage('El nombre completo es requerido'),
    body('dpi')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 13, max: 13 }).withMessage('El DPI debe tener exactamente 13 caracteres')
        .isString().withMessage('El DPI debe ser una cadena de texto'),
    body('telefono')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 8, max: 8 }).withMessage('El teléfono debe tener exactamente 8 caracteres')
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo_personal')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo personal no es válido')
        .isLength({ max: 100 }).withMessage('El correo personal no puede exceder 100 caracteres'),
    body('direccion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La dirección debe ser una cadena de texto'),
    body('fecha_nacimiento')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),
    body('genero')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género no válido')
        .isLength({ max: 15 }).withMessage('El género no puede exceder 15 caracteres'),
    body('estado_civil')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre']).withMessage('Estado civil no válido')
        .isLength({ max: 20 }).withMessage('El estado civil no puede exceder 20 caracteres'),
    body('fecha_ingreso')
        .notEmpty().withMessage('La fecha de ingreso es requerida')
        .isISO8601().toDate().withMessage('La fecha de ingreso debe ser una fecha válida'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo'),
    body('estado_empleo')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Activo', 'Inactivo', 'Suspendido', 'Jubilado']).withMessage('Estado de empleo no válido')
        .isLength({ max: 20 }).withMessage('El estado de empleo no puede exceder 20 caracteres'),
];

/**
 * Validaciones para la actualización de un empleado.
 */
const validarActualizacionEmpleado = [
    body('nombre_completo')
        .trim()
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('dpi')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 13, max: 13 }).withMessage('El DPI debe tener exactamente 13 caracteres')
        .isString().withMessage('El DPI debe ser una cadena de texto'),
    body('telefono')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ min: 8, max: 8 }).withMessage('El teléfono debe tener exactamente 8 caracteres')
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo_personal')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo personal no es válido')
        .isLength({ max: 100 }).withMessage('El correo personal no puede exceder 100 caracteres'),
    body('direccion')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('La dirección debe ser una cadena de texto'),
    body('fecha_nacimiento')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),
    body('genero')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Masculino', 'Femenino', 'Otro']).withMessage('Género no válido')
        .isLength({ max: 15 }).withMessage('El género no puede exceder 15 caracteres'),
    body('estado_civil')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre']).withMessage('Estado civil no válido')
        .isLength({ max: 20 }).withMessage('El estado civil no puede exceder 20 caracteres'),
    body('fecha_ingreso')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().toDate().withMessage('La fecha de ingreso debe ser una fecha válida'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo'),
    body('estado_empleo')
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isIn(['Activo', 'Inactivo', 'Suspendido', 'Jubilado']).withMessage('Estado de empleo no válido')
        .isLength({ max: 20 }).withMessage('El estado de empleo no puede exceder 20 caracteres'),
];

module.exports = {
    validarCreacionEmpleado,
    validarActualizacionEmpleado
};
