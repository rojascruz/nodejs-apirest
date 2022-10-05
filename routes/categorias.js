const { Router } = require("express");
const { check } = require("express-validator");

const { Categoria } = require("../controllers");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");


const router = Router();


/**
 * {{url}}/api/categoria
 */

// Obtener todas las categorias - publico
router.get('/', Categoria.getCategorias);


// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], Categoria.getCategoria);


// Crear categoria - privado - culaquier persona con un token valido
router.post('/', [
    validarJWT,
    validarCampos
], Categoria.addCategoria);


// Acutalizar categoria por id - privado - cualquier token valido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], Categoria.updateCategoria);


// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], Categoria.deleteCategoria);


module.exports = router