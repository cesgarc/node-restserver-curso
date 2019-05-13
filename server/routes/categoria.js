const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');

//Crear 5 Servicios GET


//==============
// Muestra Todas las Categorias sin Páginación
//==============

app.get('/categoria', verificaToken,  (req, res) => {
    Categoria.find({}, 'descripcion estado usuario')
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err, categorias) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo)=>{
                res.json({
                    ok:true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

//==============
// Muestra UNA Categoria Por ID
//==============

app.get('/categoria/:id', verificaToken,  (req, res) => {

    let idCategoria = req.params.id;

    Categoria.findById(idCategoria)
        .exec((err, categoria) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (categoria){
                return res.json({
                    ok:true,
                    categoria
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
// Crear Nueva Categoria
//==============

app.post('/categoria', verificaToken,  (req, res) => {

    //Tomando los Parametros
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    //Guardando en la Base de Datos
    categoria.save((err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//==============
// Modificar Categoria
//==============
app.put('/categoria/:id', verificaToken,  (req, res) => {

    let id  = req.params.id;
    //Opciones que SI quiero Actualizar
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, categoriaDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria:categoriaDB
        });
    });
});

//==============
// Eliminar Categoria
//==============
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role],  (req, res) => {

    //Solo un administrador puede Eliminar una categoria, Borrado Fisico
    let id  = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Categoría NO Encontrada!!!'
                }
            });
        }
        res.json({
            ok: true,
            categoria:categoriaBorrada,
            message: 'Categoría Eliminada!!!'
        });
    });
});


module.exports = app;