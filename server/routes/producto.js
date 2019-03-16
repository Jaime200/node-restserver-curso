const express =  require('express');
const { verificaToken } = require('../middlewares/autenticacion')

let app = express();
const Producto = require('../models/producto')
const Categoria = require('../models/categoria')


//============================
// OBTENER TODOS LOS PRODUCTOS
//===========================
app.get('/productos/', (req,res)=>{
    //trae todos los productos
    //populate: usuario y categoria
    //paginado    
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde)
    limite = Number(limite)
    Producto.find({ disponible: true })
    .populate('usuarios')
    .populate('Categoria')
    .skip(desde)
    .limit(limite)
    .exec((err,productos)=>{
        if(err){
           return res.status(400).json({
                ok: false,
                err
            });
        }
//console.log(usuarios);
        Producto.countDocuments({ disponible: true }, (err,conteo)=>{            
                    res.json({
                        ok: true,
                        cuantos: conteo,
                        productos
                        
                    })  
                })     

    })

})



//============================
// BUSCAR  LOS PRODUCTOS
//===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
      
    let termino =  req.params.termino;
    let regEx = new RegExp(termino,'i')
    console.log(regEx)
    Producto.find({ nombre: regEx })
    .populate('usuarios')
    .populate('Categoria')
    .exec((err,productos)=>{
        if(err){
           return res.status(400).json({
                ok: false,
                err
            });
        }
//console.log(usuarios);
        Producto.countDocuments({ disponible: true }, (err,conteo)=>{            
                    res.json({
                        ok: true,
                        cuantos: conteo,
                        productos
                        
                    })  
                })     

    })

})



//===========================
//OBTENER UN PRODUCTO POR ID
//===========================
app.get('/productos/:id', [verificaToken], (req,res)=>{
    //trae todos los productos
    //populate: usuario y categoria
    //paginado
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuarios')
        .populate('Categoria')
        .exec((err,ProductoDB)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }//fin if de error

            if(!ProductoDB){
                return res.status(400).json({
                    ok:false,
                    err : {
                        message: 'No se encontro la categoria'
                    }
                })
            }//fin if de error
            

        return res.status(200).json({
            ok:true,
            ProductoDB
        })

        })
})


//===========================
//CREAR UN PRODUCTO
//===========================
app.post('/productos',[verificaToken] ,(req,res)=>{

    let body = req.body
    let id = body.idCategoria
    

    if(!body.idCategoria ) {
        return res.status(400).json({
            ok:false,
            err : {
                message: 'La categoría es requerida'
            }
        })
    }

    console.log(`id Categoria  ${id}`)
    Categoria.findById(id,(err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err 
            })
        }//fin if de error

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err : {
                    message: 'No se encontro la categoria'
                }
            })
        }//fin if de error


        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: true,
            categoria: categoriaDB.id,
            usuarios: req.usuario._id,
          });

          producto.save( (err,ProductoDB ) =>{
            if(err){
                return  res.status(400).json({
                     ok: false,
                     err 
                 })
             }
    
             if(!ProductoDB){
                return  res.status(500).json({
                     ok: false,
                     err 
                 })
             }
    
             res.status(200).json({
                 ok: true,
                 producto:ProductoDB
             })
          })
    
       
    })
    
})



//===========================
//ACTUALIZAR UN PRODUCTO
//===========================
app.put('/productos/:id',[verificaToken], (req,res)=>{
    let body = req.body
    let id = req.params.id

    Producto.findById(id, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }


        if(!productoDB){
            return res.status(500).json({
                ok:false,
                err : {
                    message:'el id no existe'
                }
            })        
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria ?  body.categoria :  productoDB.categoria;
        productoDB.disponible  = body.disponible ?   body.disponible : productoDB.disponible;
        productoDB.descripcion = body.descripcion ? body.descripcion : productoDB.descripcion;

        productoDB.save((err, productoguardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            return res.json({
                ok:true,
                producto: productoguardado
            });
        })

    })
})


//===========================
//BORRAR UN PRODUCTO
//===========================
app.delete('/productos/:id', [verificaToken], (req,res)=>{
    let id = req.params.id

    Producto.findById(id, (err, productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(err){
            return res.status(500).json({
                ok:false,
                err : {
                    message: 'No existe el id'
                }
            })
        }

        productoBD.disponible = false
        productoBD.save((err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })            
            }

            return res.status(200).json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            })
        })

    })
})




module.exports = app;
