require('./config/config');

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//Para Administrar los campos
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilitar Carpeta Public para ser Accedida
app.use(express.static( path.resolve(__dirname, '../public' )));

//Configuracion Global de rutas
app.use( require('./routes/index'));

mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true},
    (err, res) => {
    if (err) throw err;
    console.log('Base de Datos On Line');
});

app.listen(process.env.PORT,() =>{
    console.log('Escuchando el puerto: ', process.env.PORT);
});

