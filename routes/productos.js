const { Router } = require("express");
const { check } = require("express-validator");
const { Producto } = require("../controllers");
const { existeCategoriaPorId, existeProductoPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");



const router = Router();


/**
 * {{url}}/api/producto
 */

// Obtener todas las producto - publico
router.get('/', Producto.getProductos);


// Obtener una producto por id - publico
router.get('/:id', [
    check('id', 'No es un ID de MongoDB valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], Producto.getProducto);


// Crear producto - privado - culaquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de MongoDB valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], Producto.addProducto);


// Acutalizar producto por id - privado - cualquier token valido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], Producto.updateProducto);



// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de MongoDB valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], Producto.deleteProducto);


module.exports = router