const express = require('express')
const Categoria = require('../models/categoria')
const { verificaToken, verificaRol } = require('../middlewares/autenticacion')

 const app = express();

// const categoria = require('../models/categoria')

// //================================
// //MOSTRAR CATEGORIA
// //=================================
app.get('/categoria', verificaToken,(req, res)=>{
console.log(`Ejecutando categoria`)


Categoria.find({})
        .sort('descripcion')
        .populate('usuarios')
        .exec((err,categorias)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }//fin if de error

            

        return res.status(200).json({
            ok:true,
            categorias
        })

        })

})


// //================================
// //MOSTRAR UNA CATEGORIA POR ID
// //=================================
app.get('/categoria/:id',[verificaToken], (req, res)=>{
    let id = req.params.id;
    Categoria.findById(id,'descripcion')
        .exec((err,categorias)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }//fin if de error

            if(!categorias){
                return res.status(400).json({
                    ok:false,
                    err : {
                        message: 'No se encontro la categoria'
                    }
                })
            }//fin if de error
            

        return res.status(200).json({
            ok:true,
            categorias
        })

        })
})


// //================================
// //CREAR UNA NUEVA CATEGORIA
// //=================================
app.post('/categoria/', [verificaToken],(req, res)=>{
    let body = req.body
    let categoria = new Categoria({
        descripcion : body.descripcion,
         usuarios : req.usuario._id,
      });

      categoria.save((err,categoriaDB)=>{
        if(err){
            return  res.status(400).json({
                 ok: false,
                 err 
             })
         }

         if(!categoriaDB){
            return  res.status(500).json({
                 ok: false,
                 err 
             })
         }


         res.status(200).json({
             ok: true,
             categoria:categoriaDB
         })
      })

})


// //================================
// //ACTUALIZAR UNA NUEVA CATEGORIA
// //=================================
app.put('/categoria/:id',verificaToken,(req, res)=>{
    console.log(req.params.id)
    let id = req.params.id
    let body = req.body

    let descCategoria = {
        descripcion : body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria,{new: true, runValidators: true} ,(err, CategoriaDB)=>{
        if(err){
            return  res.status(400).json({
                 ok: false,
                 err 
             })
         }

         if(!CategoriaDB){
            return  res.status(500).json({
                 ok: false,
                 err 
             })
         }


         return res.status(200).json({
             ok: true,
             usuario:CategoriaDB
         })
    });

})

// //================================
// //ELIMINAR UNA NUEVA CATEGORIA
// //=================================
app.delete('/categoria/:id',[verificaToken,verificaRol],(req, res)=>{
   
    let id =  req.params.id
    console.log(req.params)
    Categoria.findByIdAndRemove(id, (err, CategoriaDB)=>{
        if(err){
            return  res.status(400).json({
                 ok: false,
                 err 
             })
            }


         if(!CategoriaDB){
            return  res.status(500).json({
                 ok: false,
                 err:{message: 'el id no existe' }
             })
         }


         return res.status(200).json({
            ok: true,
            message:'Categoria borrada'
        })

    })
})

module.exports = app;

