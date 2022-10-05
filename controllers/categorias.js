const { response } = require("express");
const { Categoria } = require("../models");


// obtenerCategorias - paginado - total - populate
const getCategorias = async(req, res = response) => {

    const query= {estado:true};
    const {limite = 5, desde = 0} = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre + correo')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })

}


// obtenerCategoria - populate {}
const getCategoria = async(req, res = response) => {
    
    const {id} = req.params;
    
     // Verifica si el estado esta en falso, si lo esta mostrara un mensage que no existe el id en la base de dato
     const catEstado = await Categoria.findById(id);
     if(!catEstado.estado){
         return res.status(401).json({
             msg: `No existe el ID ${id} en la base de datos`
         })
     }

    const categorias = await Categoria.findById(id).populate('usuario', 'nombre + correo');

    res.json(categorias);

}

// Crear Categoria
const addCategoria = async(req, res = response) => {

    // Recupera los datos en del body de PostMan y lo pone en letra mayuscula
    const nombre = req.body.nombre.toUpperCase();

    // Verifica el nombre que recibio el body si existe en la Base de dato
    const categoriaDB = await Categoria.findOne({nombre});

    // Si existe en la base de datos no se agrega
    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Genera la data al guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    // Crea una nueva categoria con el nombre
    const categoria = new Categoria(data);

    // Lo Guarda en la base de dato
    await categoria.save();

    res.status(201).json(categoria);
    
}


// atualizarCategoria
const updateCategoria = async(req, res = response) => {
    
    const {id} = req.params;
    

    // Verifica si el estado esta en falso, si lo esta mostrara un mensage que no existe el id en la base de dato
    const catEstado = await Categoria.findById(id);

    if(!catEstado.estado){
        return res.status(401).json({
            msg: `No existe el ID ${id} en la base de datos`
        })
    }

    // Recupera los datos del body
    const {estado, usuario, ...data} = req.body;
    
    // Recupera el nombre en mayuscula donde ingresaste el body
    data.nombre = data.nombre.toUpperCase();

    // Recupera el Usuario que actualizo Categoria
    data.usuario = req.usuario._id;
   
    // Busca en la base de dato el ID y cuando lo enceuntre replaza los valores por lo que esta adentro de data
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true}).populate('usuario', 'nombre + correo');

    res.json({
        msg: `Se actualizo el ID: ${id}`,
        categoria
    });
}


// borrarCategoria - estado:false
const deleteCategoria = async(req, res = response) => {
    
    // recupera el parrametro del url 
    const {id} = req.params;

    // Actualiza el estado a false basado por el id
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.status(201).json({
        msg: `Se elimino el id ${id}`,
        categoria
    });
}

module.exports = {
    getCategorias,
    getCategoria,
    addCategoria,
    updateCategoria,
    deleteCategoria,
}