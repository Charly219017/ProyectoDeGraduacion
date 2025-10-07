// carpeta backend/utilidades/auditHook.js
const registrarAuditoria = async (instancia, options, accion) => {
  try {
    // Validación estricta de usuario para auditoría
    const usuario = options.usuario;
    if (!usuario || !usuario.id) {
      // Si no hay usuario, la operación no debe continuar para garantizar la auditoría.
      throw new Error('Operación no permitida: El usuario no está autenticado para registrar la auditoría.');
    }

    const { Auditoria } = instancia.sequelize.models;
    if (!Auditoria) {
      // Si el modelo de Auditoria no existe, la transacción debe fallar.
      throw new Error('El modelo Auditoria no se encontró y no se puede registrar la acción.');
    }

    const pkField = instancia.constructor.primaryKeyAttributes[0];
    const pkValue = instancia[pkField];

    let valorAnterior = null;
    let valorNuevo = null;
    let camposModificados = null;
    let descripcion = `Acción de ${accion} en ${instancia.constructor.tableName} por usuario ${usuario.nombre_usuario || usuario.id}.`;

    if (accion === 'CREAR') {
      valorNuevo = instancia.toJSON();
      descripcion = `Creación de nuevo registro en ${instancia.constructor.tableName} (ID: ${pkValue}) por ${usuario.nombre_usuario || usuario.id}.`;
    } else if (accion === 'ACTUALIZAR') {
      valorAnterior = instancia._previousDataValues;
      valorNuevo = instancia.toJSON();
      
      camposModificados = Object.keys(valorNuevo).filter(key => {
        // Excluir campos de auditoría y timestamps automáticos
        return !['creado_por', 'actualizado_por', 'fecha_creacion', 'fecha_actualizacion'].includes(key) && 
               JSON.stringify(valorAnterior[key]) !== JSON.stringify(valorNuevo[key]);
      }).join(', ');

      // Si no hay campos modificados relevantes, no se crea registro de auditoría.
      if (!camposModificados || camposModificados.length === 0) {
        return;
      }
      descripcion = `Actualización en ${instancia.constructor.tableName} (ID: ${pkValue}) por ${usuario.nombre_usuario || usuario.id}.`;

    } else if (accion === 'ELIMINAR') {
      valorAnterior = instancia.toJSON();
      descripcion = `Eliminación de registro en ${instancia.constructor.tableName} (ID: ${pkValue}) por ${usuario.nombre_usuario || usuario.id}.`;
    }

    await Auditoria.create({
      tabla_afectada: instancia.constructor.tableName,
      id_registro_text: String(pkValue),
      campo_modificado: camposModificados,
      valor_anterior: valorAnterior ? JSON.stringify(valorAnterior) : null,
      valor_nuevo: valorNuevo ? JSON.stringify(valorNuevo) : null,
      accion: accion,
      usuario: usuario.id, // Asegurarse que el campo coincida con el modelo Auditoria
      descripcion: descripcion
    }, { transaction: options.transaction });
  } catch (error) {
    console.error('Error crítico al registrar la auditoría. Revirtiendo transacción.', error);
    // Se lanza el error para abortar la transacción principal y mantener la integridad.
    throw error; 
  }
};

const auditHooks = {
  afterCreate: (instancia, options) => {
    return registrarAuditoria(instancia, options, 'CREAR');
  },
  afterUpdate: (instancia, options) => {
    // Comprobar si es un borrado lógico
    const isSoftDelete = instancia.changed('activo') && instancia.get('activo') === false;
    const accion = isSoftDelete ? 'ELIMINAR' : 'ACTUALIZAR';
    return registrarAuditoria(instancia, options, accion);
  },
  afterDestroy: (instancia, options) => {
    return registrarAuditoria(instancia, options, 'ELIMINAR');
  }
};

module.exports = auditHooks;
