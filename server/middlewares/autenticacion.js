const jwt = require('jsonwebtoken');


let rolesValidos = {
    values:  ['ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

//=========================
//Verificar toquen
//=========================
let verificaToken = (req, res, next)=>{
        console.log(`ejecutando verifica token`)
        let token = req.get('token');
        console.log('obteniendo token', token)
        jwt.verify(token,process.env.SEED ,(err,decode)=>{
            if(err){
                return res.status(401).json({
                    ok:false,
                    err: {
                        message: 'Token no valido'
                    }
                });
            }
            req.usuario = decode.usuario;
            //console.log(req.usuario )
            return next();
             
        });
        
       
};

//=========================
//Verificar ROL
//=========================

let verificaRol = (req, res, next)=>{
    console.log(`ejecutando verifica rol`)
    let usuario = req.usuario;
    console.log (usuario)
        let rol = usuario.role
       console.log(` Verifica rol ${usuario.role}` )
        if( usuario.role ==='ADMIN_ROLE' ){
            console.log('entro if')
            next();
            return
        }


        return res.status(401).json({
            ok:false,
            err: {
                message: 'Rol no válido'
                
            }
        });
 
};


//=========================
//Verificar tokenIMG
//=========================

let verificaTokenIMG = (req, res, next)=>{
    let token = req.query.token;
    jwt.verify(token,process.env.SEED ,(err,decode)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        req.usuario = decode.usuario;
        //console.log(req.usuario )
        return next();
         
    });
}


module.exports = {
    verificaToken,
    verificaRol,
    verificaTokenIMG
} 