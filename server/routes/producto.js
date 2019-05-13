const express = require('express');
const { verificaToken} = require('../middlewares/autenticacion');

const app = express();
const Producto = require('../models/producto');

//==============
// Obtener Productos
//==============

app.get('/producto', verificaToken,  (req, res) => {

    // Los trae Todos, Populate usuario y categoria
    // Paginado

    let desde = req.query.desde || 0;
    desde= Number(desde);
    let limite = req.query.limite || 5;
    limite= Number(limite);

    Producto.find({}, 'nombre precioUni descripcion disponible categoria usuario')
        .sort('nombre')
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo)=>{
                res.json({
                    ok:true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

//==============
// Obtener un producto Por ID
//==============

app.get('/producto/:id', verificaToken,  (req, res) => {

    let idProducto = req.params.id;

    Producto.findById(idProducto)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, producto) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (producto){
                return res.json({
                    ok:true,
                    producto
                });
            }
            else{
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Id NO Encontrado'
                    }
                });
            }
        });
});

//==============
// Buscar Productos
//==============
app.get('/producto/buscar/:termino', verificaToken,  (req, res) => {

    let termino = req.params.termino;

    //Expresion Regular
    let regex = new RegExp(termino,'i');

    Producto.find({ nombre: regex})
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err, productos) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.status(201).json({
                ok: true,
                productos
            });
        });
});


//==============
// Crear Nuevo Producto
//==============

app.post('/producto', verificaToken,  (req, res) => {

    //Tomando los Parametros
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    //Guardando en la Base de Datos
    producto.save((err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//==============
// Modificar Producto
//==============
app.put('/producto/:id', verificaToken,  (req, res) => {

    let id  = req.params.id;
    //Opciones que SI quiero Actualizar
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            producto:productoDB
        });
    });
});

//==============
// Eliminar Producto
//==============
app.delete('/producto/:id', verificaToken,  (req, res) => {

    //Borrar Logico
    //Solo un administrador puede Eliminar una categoria, Borrado Fisico
    let id  = req.params.id;
    let cambiaEstado = {
        disponible:false
    }
    Producto.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto NO Encontrado!!!'
                }
            });
        }
        res.json({
            ok: true,
            producto:productoDB,
            message: 'Producto Eliminado!!!'
        });
    });
});


module.exports = app;

