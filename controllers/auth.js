const { response } = require("express");
const { Usuario } = require("../models");

const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");


const login = async(req, res = response) => {
    
    const {correo, password} = req.body;


    try {
        
        // Verificar si el EMAIL existe
        const usuario = await Usuario.findOne({correo});

        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto'
            })
        }

        //  Verificar si el estado esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - estado:false'
            });
        }

        // Verificar la contrasena 
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correcto - password'
            });
        }

        // Generar el Json Web Token (JWT)
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el ADMIN'
        })
    }
}


module.exports = {
    login
}