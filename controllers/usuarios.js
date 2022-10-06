const { response } = require("express");

const {Usuario} = require('../models')
const bcryptjs  = require('bcryptjs');




// Mostrar limite de usuario
// const usersGet = async(req, res = response) => {
    
//     const query = {estado:true};
//     const {limite = 5, desde = 0} = req.query;

//     const [total, usuarios] = await Promise.all([
//         Usuario.countDocuments(query),
//         Usuario.find(query)
//             .skip(Number(desde))
//             .limit(Number(limite))
//     ]);


//     res.json({
//         total,
//         usuarios
//     })

// }

const usersGetE = async(req, res = response) => {
    

    const {id} = req.query;
    const usuario = await Usuario.findById(id);

    if(!usuario.id){
        return res.status(401).json({
            msg: `No existe ete ID ${id} en la base de datos`
        })
    }
    

    res.json(usuario)

}

// Mostrar solo un usuario
const userGet = async(req, res = response) => {


    const {id} = req.params;
    const usuario = await Usuario.findById(id);

    if(!usuario.estado){
        return res.status(400).json({
            msg: 'No existe el usuario'
        })
    }

    res.json(usuario)


}


// Agregar un Usuario
const usersPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;

    // Crear un usuario y poner los valores
    const usuario = new Usuario({nombre, correo, password, rol});

    // Emcriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    await usuario.save();

    res.json({
        usuario
    })

}

// Actualizar un usuario
const usersPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, correo, ...resto} = req.body;

    // TODO: Validar contrasena en la base de datos

    if(password){
        // Emcriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        msg: `Se actualizo el ID: ${id}`,
        usuario
    });
}


const usersDelete = async(req, res = response) => {

    // recupera el parrametro del url 
    const {id} = req.params;

    // Actualiza el estado a false basado por el id
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json({
        msg: `Se elimindo el ID: ${id}`,
        usuario
    });

}



module.exports = {
    userGet,
    usersGetE,
    usersPost,
    usersPut,
    usersDelete,
}