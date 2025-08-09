// carpeta: controladores/authControlador.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { Usuarios, Roles, Auditoria } = require('../modelos');
const logger = require('../utilidades/logger');
const config = require('../configuracion/configuracion');

const login = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      logger.warn('Datos de login inválidos:', errores.array());
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
      // CAMBIO AQUÍ: Usamos 'id_usuario' y 'detalles'
      await Auditoria.create({
        accion: 'LOGIN_FAILED',
        id_usuario: null, // No tenemos el id del usuario, así que es null
        detalles: { mensaje: `Intento de login fallido para usuario no registrado: ${nombre_usuario}` },
        tabla_afectada: 'usuarios'
      });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    
    if (!contrasenaValida) {
      logger.warn(`Intento de login fallido: contraseña incorrecta - ${nombre_usuario}`);
      // CAMBIO AQUÍ: Usamos 'id_usuario' y 'detalles'
      await Auditoria.create({
        accion: 'LOGIN_FAILED',
        id_usuario: usuario.id_usuario,
        detalles: { mensaje: `Intento de login fallido: contraseña incorrecta` },
        tabla_afectada: 'usuarios'
      });
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario.id_usuario);

    // CAMBIO AQUÍ: Usamos 'id_usuario' y 'detalles'
    await Auditoria.create({
      accion: 'LOGIN_SUCCESS',
      id_usuario: usuario.id_usuario,
      detalles: { mensaje: `Login exitoso` },
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
        roles: usuario.roles?.nombre_rol || 'Invitado'
      }
    });
  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

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
    
    // CAMBIO AQUÍ: Usamos 'id_usuario' y 'detalles'
    await Auditoria.create({
      accion: 'REGISTRO',
      id_usuario: req.usuario ? req.usuario.id : null,
      detalles: { mensaje: `Registro de nuevo usuario: ${nuevoUsuario.nombre_usuario}` },
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

const generarToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiracion
  });
};

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
      roles: usuario.roles?.nombre_rol || 'Invitado'
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