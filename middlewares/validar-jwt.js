const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const {Usuario} = require('../models');

const validarJWT = async(req = request, res = response, next) => {
    
    const token = req.header('x-token');

    if(!token) {
        return res.status(400).json({
            msg: 'No hay token en la peticion'
        });
    }


    try {
        
        // Esto es para verificar que sea realmente un token que NO se haya manipulado entre otras cosas
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en la BD'
            });
        }

        if(!usuario.estado){
            
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            });
        }

        req.usuario = usuario;
        next();
         



    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}


module.exports = {
    validarJWT,
}