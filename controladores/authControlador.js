// Carpeta: backend/controladores/authControlador.js

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { Usuarios, Roles, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');
const config = require('../configuracion/configuracion');

/**
 * Genera un token JWT para el usuario.
 * @param {Object} usuario - Objeto de usuario con id, nombre y rol.
 * @returns {string} Token JWT.
 */
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id_usuario, 
      nombre: usuario.nombre_usuario, 
      rol: usuario.roles?.nombre_rol 
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiracion,
    }
  );
};

/**
 * Controlador para el inicio de sesión de usuarios.
 */
const login = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      logger.warn('Datos de login inválidos:', errores.array());
      // Log de intento de login con datos inválidos
      await Auditoria.create({
        accion: 'LOGIN_FAILED',
        usuario: null,
        descripcion: JSON.stringify({
          mensaje: 'Intento de login fallido: datos de entrada inválidos',
          errores: errores.array()
        }),
        tabla_afectada: null,
        id_registro_afectado: null,
      });
      return res.status(400).json({
        mensaje: 'Datos de entrada inválidos',
        errores: errores.array()
      });
    }

    const { nombre_usuario, contrasena } = req.body;

    const usuario = await Usuarios.findOne({
      where: {
        [Sequelize.Op.or]: [
          { nombre_usuario },
          { correo: nombre_usuario }
        ]
      },
      include: [{ model: Roles, as: 'roles' }]
    });

    if (!usuario) {
      logger.warn(`Intento de login fallido: usuario no encontrado - ${nombre_usuario}`);
      // El campo 'descripcion' ahora almacena un JSON string
      await Auditoria.create({
        accion: 'LOGIN_FAILED',
        usuario: null,
        descripcion: JSON.stringify({
          mensaje: `Intento de login fallido para usuario no registrado`,
          correo_ingresado: nombre_usuario
        }),
        tabla_afectada: 'usuarios',
        id_registro_afectado: null
      });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash || '');
    
    if (!contrasenaValida) {
      logger.warn(`Intento de login fallido: contraseña incorrecta - ${nombre_usuario}`);
      // El campo 'descripcion' ahora almacena un JSON string
      await Auditoria.create({
        accion: 'LOGIN_FAILED',
        usuario: usuario.id_usuario,
        descripcion: JSON.stringify({
          mensaje: `Intento de login fallido: contraseña incorrecta`,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre_usuario
          }
        }),
        tabla_afectada: 'usuarios',
        id_registro_afectado: usuario.id_usuario
      });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    // El campo 'descripcion' ahora almacena un JSON string
    await Auditoria.create({
      accion: 'LOGIN_SUCCESS',
      usuario: usuario.id_usuario,
      descripcion: JSON.stringify({
        mensaje: `Login exitoso para usuario: ${usuario.nombre_usuario}`,
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre_usuario,
          correo: usuario.correo
        }
      }),
      tabla_afectada: 'usuarios',
      id_registro_afectado: usuario.id_usuario
    });

    logger.info(`Login exitoso para usuario: ${usuario.nombre_usuario}`);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol: usuario.roles?.nombre_rol || 'Invitado'
      }
    });
  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Controlador para el registro de nuevos usuarios.
 */
const registro = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      logger.warn('Datos de registro inválidos:', errores.array());
      return res.status(400).json({
        mensaje: 'Datos de entrada inválidos',
        errores: errores.array()
      });
    }

    const { nombre_usuario, correo, contrasena, id_rol } = req.body;
    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    const nuevoUsuario = await Usuarios.create({
      nombre_usuario,
      correo,
      contrasena_hash,
      id_rol,
      creado_por: req.usuario ? req.usuario.id : null
    });
    
    // El campo 'descripcion' ahora almacena un JSON string
    await Auditoria.create({
      accion: 'REGISTRO',
      usuario: req.usuario ? req.usuario.id : null,
      descripcion: JSON.stringify({
        mensaje: `Registro de nuevo usuario: ${nuevoUsuario.nombre_usuario}`,
        nuevo_usuario: {
          id: nuevoUsuario.id_usuario,
          nombre_usuario: nuevoUsuario.nombre_usuario,
          correo: nuevoUsuario.correo
        },
        realizado_por: req.usuario ? {
          id: req.usuario.id,
          nombre: req.usuario.nombre_usuario
        } : null
      }),
      tabla_afectada: 'usuarios',
      id_registro_afectado: nuevoUsuario.id_usuario
    });

    logger.info(`Nuevo usuario registrado: ${nuevoUsuario.nombre_usuario}`);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id_usuario,
        nombre_usuario: nuevoUsuario.nombre_usuario,
        correo: nuevoUsuario.correo
      }
    });
  } catch (error) {
    logger.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Controlador para obtener el perfil del usuario autenticado.
 */
const perfil = async (req, res) => {
  try {
    const usuario = await Usuarios.findByPk(req.usuario.id, {
      include: [{ model: Roles, as: 'roles' }]
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({
      id: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      rol: usuario.roles?.nombre_rol || 'Invitado'
    });
  } catch (error) {
    logger.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  login,
  registro,
  perfil
};
