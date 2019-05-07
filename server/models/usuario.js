const mongoose = require ('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un Rol Válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type:String,
        required:[true,'El Nombre es Necesario']
    },
    email: {
        type:String,
        unique:true,
        required:[true,'El Correo es Necesario']
    },
    password: {
        type:String,
        required:[true,'La Contraseña es Obligatoria']
    },
    img: {
        type:String,
        required:false
    },
    role: {
        type:String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type:Boolean,
        default:true
    },
    google: {
        type:Boolean,
        default:false
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe ser único.'});

module.exports = mongoose.model ( 'Usuario', usuarioSchema );