const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//-------------------
const _ = require('underscore');
const saltRounds = process.env.SALT_ROUNDS;
//Configuracion app
const app = express()


app.post('/login',(req,res)=>{

    let body = req.body;

    Usuario.findOne({email : body.email}, ( err, usuarioDB )=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                messages: 'Usuario o contraseña incorrecto'
            });
        }

        if( !bcrypt.compareSync( body.password, usuarioDB.password )){
            return res.status(400).json({
                ok: false,
                err: {messages: 'Usuario o (contraseña) incorrecto'}
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({
            ok:true,
            usuario:usuarioDB,
            token

        })

    })

});

//CONFIGURACIONES DE GOOGLE
let verificar = async  ( token) =>{
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload
  }


 app.post('/google',async (req, res)=>{
    console.log(req.body)
    let body = req.body;
    let token = body.idtoken;

    if(!token){
         return res.status(403).json({
            ok:false,
            err: 'error en el token'
        })
    }
    let googleUser = await verificar(token)
                .then(data =>{
                   return {
                    email : data.email,
                    name : data.name,
                    img: data.picture,
                    google : true
                 }
                })
                .catch(err => {
                    return res.status(403).json({
                        ok:false,
                        err: err
                    })
                });

                
    Usuario.findOne({email : googleUser.email}, (err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(usuarioDB){

            if(usuarioDB.google===false){
                return res.status(400).json({
                    ok: false,
                    err :{
                        message: "debe usar la autenticación normal"
                    } 
                })
            } else {
                let token = jwt.sign({
                    usuario : googleUser
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else {
            //si el usuaio no existe en la BD
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'

            usuario.save((err, UsuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })                
                }
                let token = jwt.sign({
                    usuario : googleUser
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

                res.status(200).json({
                    ok: true,
                    usuario: UsuarioDB,
                    token
                });
            })
        }
    })    
   
});

module.exports = app