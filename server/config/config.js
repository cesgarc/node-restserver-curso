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
// Expiración de Vencimiento para Token
//==============
// 60 Seg * 60Min * 24H * 30Dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==============
// Seed
//==============

process.env.SEED = process.env.SEED  || 'este-es-el-seed-desarrollo';

//==============
// Base de Datos
//==============

let urlDB;
if (process.env.NODE_ENV === 'dev'){
    urlDB= 'mongodb://localhost:27017/cafe';
}
else{
    urlDB= process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==============
// GOOGLE CLIENT ID
//==============

process.env.CLIENT_ID = process.env.CLIENT_ID ||  '495113351195-9409vkfhtf0nj9r1ea23h07ttoeo9dps.apps.googleusercontent.com';