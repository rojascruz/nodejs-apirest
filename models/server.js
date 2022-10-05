const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');




class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.path = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            buscar: '/api/buscar',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        }

        // Conectarme en la base de datos
        this.conectarDB();
        // middleware
        this.middleware();

        // Router
        this.router();
    }


    async conectarDB(){
        await dbConnection();
    }

    middleware() {

        // CORS
        this.app.use(cors());

        // Lectura y parse del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));
    }

    router() {
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.productos, require('../routes/productos'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        
    }




    // Para escuchar el puerto
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        })
    }
}


module.exports = Server;