// backend/controladores/mantenimientoControlador.js
const { exec } = require('child_process');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const config = require('../configuracion/configuracion.js');
const logger = require('../utilidades/logger');

/**
 * Controlador para obtener una lista completa de todos los usuarios
 * y sus roles asociados.
 */
const obtenerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll({
      where: {
        activo: true
      },
      attributes: { exclude: ['contrasena_hash'] },
      include: [{ 
        model: Roles, 
        as: 'roles',
        attributes : ['nombre_rol']
      }]
    });

    const usuariosConRoles = usuarios.map(usuario => ({
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      rol: usuario.roles ? usuario.roles.nombre_rol : 'Sin rol',
      activo: usuario.activo
    }));

    res.json(usuariosConRoles);
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Controlador para crear un nuevo usuario.
 * Hashea la contraseña y registra la acción en la tabla de auditoría.
 */
const crearUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        mensaje: 'Datos de entrada inválidos',
        errores: errors.array() 
      });
    }
    const { nombre_usuario, correo, contrasena, id_rol } = req.body;

    const contrasena_hash = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuarios.create({
      nombre_usuario,
      correo,
      contrasena_hash,
      id_rol,
      creado_por: req.usuario.id
    });
    
    //Se usa el campo 'descripcion' y se serializa el objeto JSON
    await Auditoria.create({
      accion: 'CREAR_USUARIO',
      usuario: req.usuario.id,
      descripcion: JSON.stringify({ 
        mensaje: `Creación de usuario: ${nuevoUsuario.nombre_usuario}`,
        nuevo_usuario_id: nuevoUsuario.id_usuario
      }),
      tabla_afectada: 'usuarios',
      id_registro_afectado: nuevoUsuario.id_usuario
    });

    logger.info(`Usuario creado exitosamente: ${nuevoUsuario.nombre_usuario} por ${req.usuario.nombre_usuario}`);
    res.status(201).json({
      mensaje: 'Usuario creado exitosamente'
    });
  } catch (error) {
    logger.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * Controlador para actualizar un usuario existente.
 */
const actualizarUsuario = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        mensaje: 'Datos de entrada inválidos',
        errores: errors.array()
      });
    }
    const { id_usuario } = req.params;
    const { nombre_usuario, correo, contrasena, id_rol, activo } = req.body;
    
    const usuarioAActualizar = await Usuarios.findByPk(id_usuario);

    if (!usuarioAActualizar) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const datosActualizados = {
      nombre_usuario,
      correo,
      id_rol,
      activo,
      actualizado_por: req.usuario.id
    };
    
    if (contrasena) {
      datosActualizados.contrasena_hash = await bcrypt.hash(contrasena, 10);
    }
    
    const valorAnterior = { ...usuarioAActualizar.get({ plain: true }) };
    delete valorAnterior.contrasena_hash;

    await usuarioAActualizar.update(datosActualizados);

    // Preparamos los datos para la auditoría, excluyendo la contraseña.
    const datosParaAuditoria = { ...req.body };
    delete datosParaAuditoria.contrasena;

    //Se usa el campo 'descripcion' y se serializa el objeto JSON
    await Auditoria.create({
      accion: 'ACTUALIZAR_USUARIO',
      usuario: req.usuario.id,
      tabla_afectada: 'usuarios',
      id_registro: id_usuario,
      valor_anterior: JSON.stringify(valorAnterior),
      valor_nuevo: JSON.stringify(datosParaAuditoria),
      descripcion: JSON.stringify({ mensaje: `Actualización de usuario: ${usuarioAActualizar.nombre_usuario}` })
    });

    logger.info(`Usuario actualizado exitosamente: ${usuarioAActualizar.nombre_usuario} por ${req.usuario.nombre_usuario}`);
    res.json({
      mensaje: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    logger.error(`Error al actualizar usuario: ${req.usuario.nombre_usuario}`, error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/** * Controlador para eliminar un usuario existente.
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const usuarioAEliminar = await Usuarios.findByPk(id_usuario);

    if (!usuarioAEliminar) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Borrado lógico: cambiar el estado a false (inactivo)
    await usuarioAEliminar.update({
      activo: false,
      actualizado_por: req.usuario.id,
      fecha_actualizacion: new Date()
    });

    await Auditoria.create({
      accion: 'ELIMINAR_USUARIO (LÓGICO)',
      usuario: req.usuario.id,
      tabla_afectada: 'usuarios',
      id_registro: usuarioAEliminar.id_usuario,
      campo_modificado: 'activo',
      valor_anterior: 'true',
      valor_nuevo: 'false',
      descripcion: JSON.stringify({ mensaje: `Desactivación de usuario: ${usuarioAEliminar.nombre_usuario}` })
    });

    logger.info(`Usuario eliminado exitosamente: ${usuarioAEliminar.nombre_usuario} por ${req.usuario.nombre_usuario}`);
    res.json({ mensaje: 'Usuario desactivado exitosamente' });
  } catch (error) {
    logger.error(`Error al eliminar usuario: ${req.params.id_usuario}: `, error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/** * Controlador para obtener todos los registros de auditoría.
 */
const obtenerAuditoria = async (req, res) => {
  try {
    const auditoria = await Auditoria.findAll({
      order: [['fecha', 'DESC']],
    });
    res.json(auditoria);
  } catch (error) {
    logger.error('Error al obtener registros de auditoria:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerTodosUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerAuditoria
};