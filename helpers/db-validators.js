const {Role, Usuario, Categoria, Producto} = require('../models');


/**
 * Validar si el Rol es valido en Usuario
 */
const esRoleValido = async( rol = '' ) => {
    
    // Entra a la base de datos y verifica si existe el rol
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}


/**
 * Validar si el Email existe en el Schema de Usuario
 */

const emailExiste = async(correo = '') => {
    
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`Este email: ${correo} ya esta registrado`);

    }
}

const existeUsuarioPorId = async(id = '') => {
    
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario) {
        throw new Error(`Este ID: ${id} no existe`);
    }
}

const existeCategoriaPorId = async(id = '') => {
    
    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria) {
        throw new Error(`Este ID: ${id} no existe`);
    }
}

const existeProductoPorId = async(id = '') => {
    
    const existeProducto = await Producto.findById(id);

    if(!existeProducto) {
        throw new Error(`Este ID: ${id} no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeCategoriaPorId,
    existeProductoPorId,
    existeUsuarioPorId,
}