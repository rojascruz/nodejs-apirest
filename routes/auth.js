const { Router } = require("express");
const { check } = require('express-validator');

const { Auth } = require('../controllers');
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();



router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatorio').not().isEmpty(),
    validarCampos
], Auth.login);



module.exports = router