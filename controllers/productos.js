const { response } = require("express");
const {Producto} = require("../models");




const getProductos = async(req, res = response) => {
    
    const query = {estado:true};
    const {limite = 5, desde = 0} = req.query;

    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre + correo')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]); 
    res.json({
       total, 
       producto
    })
}


const getProducto = async(req, res = response) => {
    
    const {id} = req.params;

    const prodEstado = await Producto.findById(id);

    if(!prodEstado.estado) {
        return res.status(401).json({
            msg: `No existe el ID ${id} en la base de datos`
        })
    }

    const producto = await Producto.findById(id)
                    .populate('usuario', 'nombre + correo')
                    .populate('categoria', 'nombre')

    res.json({
        producto
        
    })
}


const addProducto = async(req, res = response) => {
    
    const {estado, usuario, ...body} = req.body;

    // ENtra a la base de dato y verifica si encuentra el nombre del body
    const productoDB = await Producto.findOne({nombre:body.nombre});

    //  SI lo encuentra dara error porque no se puede repetir
    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    
    // Crea un nuevo Producto y gurdara todo que tiene data
    const producto = new Producto(data);

    // Lo guarda en la base de datos 
    await producto.save();

    res.json(producto);
}


const updateProducto = async(req, res = response) => {
    
    const {id} = req.params;
    const prodEstado = await Producto.findById(id);

    if(!prodEstado.estado) {
        return res.status(400).json({
            msg: `El ID: ${id}, no existe en la base de datos`
        })
    }


    const {estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});


    res.json({
      producto
    })
}


const deleteProducto = async(req, res = response) => {
    
    const {id} = req.params;
    
    const delProducto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});

    res.json({
        msg: `El ID: ${id} se ha eliminado exitosamente de la BD`,
        delProducto
    })
}



module.exports = {
    getProductos,
    getProducto,
    addProducto,
    updateProducto,
    deleteProducto
}