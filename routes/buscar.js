const { Router } = require("express");
const { Buscar } = require("../controllers");



const router = Router();



router.get('/:coleccion/:termino', Buscar.buscar)


module.exports = router