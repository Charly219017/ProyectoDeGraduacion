// carpeta backend/utilidades/jwt.js
const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Genera un token JWT para un usuario
 * @param {Object} usuario - Objeto del usuario
 * @returns {string} Token JWT
 */
const generarToken = (usuario) => {
  try {
    const payload = {
      id: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.rol?.nombre_rol || 'Invitado' 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '5h'
    });

    logger.info(`Token generado para usuario: ${usuario.nombre_usuario}`);
    return token;
  } catch (error) {
    logger.error('Error al generar token JWT:', error);
    throw new Error('Error al generar token de autenticación');
  }
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload del token decodificado
 */
const verificarToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info(`Token verificado para usuario: ${decoded.nombre_usuario}`);
    return decoded;
  } catch (error) {
    logger.error('Error al verificar token JWT:', error.message);
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token extraído o null
 */
const extraerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

module.exports = {
  generarToken,
  verificarToken,
  extraerToken
};