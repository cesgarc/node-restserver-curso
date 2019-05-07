//Declaración de Variables Globales

//==============
// PUERTO
//==============

process.env.PORT = process.env.PORT || 3001;

//==============
// Entorno
//==============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// Base de Datos
//==============

let urlDB;
if (process.env.NODE_ENV === 'dev'){
    urlDB= 'mongodb://localhost:27017/cafe';
}
else{
    urlDB= 'mongodb+srv://cesgarc:E1aVyZW3CHPXPgBW@cesgarc-cghnb.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
