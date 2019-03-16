const express = require('express')
const Usuario = require('../models/usuario')
const { verificaToken, verificaRol } = require('../middlewares/autenticacion')
const bcrypt = require('bcrypt');
const _ = require('underscore')
const saltRounds = 10;
//Configuracion app
const app = express()


//Rutas
app.get('/usuario',[verificaToken],(req, res)=> {
    console.log('ejecutando usuario')
    /*console.log(req.usuario);
    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });*/
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde)
    limite = Number(limite)
    Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios)=>{
                if(err){
                   return res.status(400).json({
                        ok: false,
                        err
                    });
                }
    //console.log(usuarios);
                Usuario.countDocuments({ estado: true }, (err,conteo)=>{            
                            res.json({
                                ok: true,
                                usuarios,
                                cuantos: conteo
                            })  
                        })     

            })
  })
   
app.post('/usuario',[verificaToken,verificaRol],function (req, res) {
      let body = req.body
      
      let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,saltRounds),
        role: body.role
      });

      usuario.save( (err,usuarioDB) =>{
          if(err){
             return  res.status(400).json({
                  ok: false,
                  err 
              })
          }

          res.status(200).json({
              ok: true,
              usuario:usuarioDB
          })
      }) 
      
    })
     
  app.put('/usuario/:id', verificaToken, function (req, res) {
      console.log(req.params.id)
      let id = req.params.id
      let body = _.pick(req.body,['nombre','email','img','role','estado']);
       
      Usuario.findByIdAndUpdate(id, body,{new: true, runValidators: true} ,(err, usuarioDB)=>{
        if (err){
             return res.status(400).json({
                 ok:false,
                 err
             })
        }        
        res.json({
                id,
                usuario:usuarioDB
            } );          
      })
  
  })
  
  app.delete('/usuario/:id',verificaToken ,function (req, res) {
    let id = req.params.id
    let cambiaEstado = {
        estado : false
    }
    // Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true},(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    })


  })

  module.exports = app