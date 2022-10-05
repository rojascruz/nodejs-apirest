const { response } = require("express");
const { isValidObjectId } = require("mongoose");
// const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");



const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);  // SI es True

    // Verifica si el ID es real y existe
    if(esMongoID){
        // Revisa si el ID existe
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : [] // Esto es una condicion ternario donde si existe el ID pondra como arreglo el usuario de lo contrario estara vacio
        });
    }

    // Esto es para que no sea case sensitive lo busque por una letra (Expresion regular)
    const regexp = new RegExp( termino, 'i');

    // Esto es un sistema de busqueda donde buscara por nombre o por correo
    const usuarios = await Usuario.find({
        $or: [{nombre: regexp}, {correo: regexp}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
}



const buscarCategoria = async(termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);  // SI es True

    // Verifica si el ID es real y existe
    if(esMongoID){
        // Revisa si el ID existe
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : [] // Esto es una condicion ternario donde si existe el ID pondra como arreglo el usuario de lo contrario estara vacio
        });
    }

    // Esto es para que no sea case sensitive lo busque por una letra (Expresion regular)
    const regexp = new RegExp( termino, 'i');

    // Esto es un sistema de busqueda donde buscara por nombre o por correo
    const categorias = await Categoria.find({nombre: regexp,estado: true});

    res.json({
        results: categorias
    });
}


const buscarProducto = async(termino = '', res = response) => {

    const esMongoID = isValidObjectId(termino);  // SI es True

    // Verifica si el ID es real y existe
    if(esMongoID){
        // Revisa si el ID existe
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre')
                                .populate('usuario', 'nombre');
        return res.json({
            results: (producto) ? [producto] : [] // Esto es una condicion ternario donde si existe el ID pondra como arreglo el usuario de lo contrario estara vacio
        });
    }

    // Esto es para que no sea case sensitive lo busque por una letra (Expresion regular)
    const regexp = new RegExp( termino, 'i');

    // Esto es un sistema de busqueda donde buscara por nombre o por correo
    const productos = await Producto.find({nombre: regexp,estado: true})
                                .populate('categoria', 'nombre')
                                .populate('usuario', 'nombre');

    res.json({
        results: productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break
        case 'categorias':
            buscarCategoria(termino, res);
        break
        case 'productos':
            buscarProducto(termino, res);
        break
    
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }
} 



module.exports = {
    buscar,
}