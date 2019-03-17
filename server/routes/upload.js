const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs =  require('fs');
const path = require('path');

// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res)=> {

    let tipo =  req.params.tipo
    let id =  req.params.id
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err:{
                message : 'no se ha seleccionado un archivo'
            }
        });
      }

      //Validar tipo
      let tipoValidos = ['productos','usuarios']

      if(tipoValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok:false,
            err: {
                message:'Los tipos permitidos son ' 
                        + tipoValidos.join(', ')
            }

        })
      }

      let archivoSubir = req.files.archivo;      
      let ArchivoSplit = archivoSubir.name.split('.')
      let extension = ArchivoSplit[ArchivoSplit.length - 1]
  
      //Extensiones permitidas
      let extensionesValidas = ['png','jpg','gif','jpeg']

      if (extensionesValidas.indexOf(extension) < 0){
          return res.status(400).json({
              ok:false,
              err: {
                  message:'Las extensoones permitidas son ' 
                          + extensionesValidas.join(', ')
              },
              ext: extension

          })
      }

    // Cambiar nombre al archivo
    // 
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${ extension }`
      
      archivoSubir.mv(`uploads/${tipo}/${ nombreArchivo }`, (err) =>{
        if (err)
          return res.status(500).json({
            ok:false,      
            err 
        });
        
        //Imagen cargada
        if( tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo)
        }else if( tipo === 'productos'){
            
            imagenProducto(id, res, nombreArchivo)
        }
        

        // res.status(200).json({
        //     ok:true,
        //     message:'imagen subida correctamente'
        // });

      });
});

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err,ProductoDB)=>{
        if (err){
            borrarImagen('productos' ,ProductoDB.img)
            return res.status(500).json({
                ok:false,
                err
            });   
        }


        if(!ProductoDB){
            borrarImagen('productos' ,ProductoDB.img)
            return res.status(400).json({
                ok:false,
                err:{
                    message :'El producto no existe'
                }
            }); 
        }

        borrarImagen('productos' ,ProductoDB.img)

        ProductoDB.img = nombreArchivo
        ProductoDB.save( (err, productoGuardado)=>{
            if(err){
                borrarImagen('productos' ,ProductoDB.img)
                return res.status(500).json({
                    ok:false,
                    err
                });   
            }
    
            res.json({
                ok:true,
                usuario:productoGuardado,
                img:nombreArchivo
            })//res.json 
    
        } );//UsuarioDB.Save


    })

    
}

function imagenUsuario(id, res, nombreArchivo){

Usuario.findById(id,(err,UsuarioBD)=>{

    if (err){
        borrarImagen('usuarios' ,UsuarioBD.img)
        return res.status(500).json({
            ok:false,
            err
        });   
    }

    //Verificamos si la imagen existe
    if(!UsuarioBD){
        borrarImagen('usuarios' ,UsuarioBD.img)
        return res.status(400).json({
            ok:false,
            err:{
                message :'El usuario no existe'
            }
        }); 
    }

    //Borramos archivos si existe
    borrarImagen('usuarios' ,UsuarioBD.img)

    UsuarioBD.img = nombreArchivo

    UsuarioBD.save( (err, usuarioGuardado)=>{
        if(err){
            borrarImagen('usuarios' ,UsuarioBD.img)
            return res.status(500).json({
                ok:false,
                err
            });   
        }

        res.json({
            ok:true,
            usuario:usuarioGuardado,
            img:nombreArchivo
        })//res.json 

    } );//UsuarioDB.Save

})
}

function borrarImagen(Tipo, nombreImagen){
    let pathImagen = path.resolve(__dirname,`../../uploads/${ Tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app