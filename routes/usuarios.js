const { Router } = require("express");
const { Usuario } = require("../controllers");

const { check } = require('express-validator');
const { validarCampos } = require("../middlewares/validar-campos");
const { esRoleValido, emailExiste, existeUsuarioPorId } = require("../helpers/db-validators");
const { validarJWT } = require("../middlewares/validar-jwt");
const { tieneRole } = require("../middlewares/validar-roles");

const router = Router();



router.get('/', Usuario.usersGet);

router.get('/:id', Usuario.userGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo').custom(emailExiste),
    check('password','El password debe de ser mas de 6 caracteres').isLength({min:6}),
    check('rol').custom(esRoleValido),
    validarCampos
], Usuario.usersPost);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], Usuario.usersPut);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), // Este funciona para ver si tiene ROL
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], Usuario.usersDelete);



module.exports = router;