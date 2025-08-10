// carpeta: backend/utilidades/empleadoValidadores.js
const { body } = require('express-validator');

/**
 * Validaciones para la creación de un nuevo empleado.
 */
const validarCreacionEmpleado = [
    body('nombre_completo')
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('dpi')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El DPI debe ser una cadena de texto'),
    body('telefono')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo_personal')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo personal no es válido'),
    body('fecha_ingreso')
        .isISO8601().toDate().withMessage('La fecha de ingreso debe ser una fecha válida'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo'),
    body('estado_empleo')
        .isIn(['Activo', 'Inactivo', 'Suspendido', 'Jubilado']).withMessage('Estado de empleo no válido'),
];

/**
 * Validaciones para la actualización de un empleado.
 */
const validarActualizacionEmpleado = [
    body('nombre_completo')
        .optional()
        .isLength({ min: 2, max: 100 }).withMessage('El nombre completo debe tener entre 2 y 100 caracteres'),
    body('dpi')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El DPI debe ser una cadena de texto'),
    body('telefono')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo_personal')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail().withMessage('El correo personal no es válido'),
    body('fecha_ingreso')
        .optional()
        .isISO8601().toDate().withMessage('La fecha de ingreso debe ser una fecha válida'),
    body('id_puesto')
        .optional({ nullable: true, checkFalsy: true })
        .isInt({ gt: 0 }).withMessage('El ID del puesto debe ser un número entero positivo'),
    body('estado_empleo')
        .optional()
        .isIn(['Activo', 'Inactivo', 'Suspendido', 'Jubilado']).withMessage('Estado de empleo no válido'),
];

module.exports = {
    validarCreacionEmpleado,
    validarActualizacionEmpleado
};
