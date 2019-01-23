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
            next();

        });
        
       
};

//=========================
//Verificar ROL
//=========================

let verificaRol = (req, res, next)=>{
    console.log(`ejecutando verifica rol`)
    let usuario = req.usuario;
        let rol = usuario.role
       console.log(` Verifica rol ${usuario.role}` )
        if( rol ==='ADMIN_ROLE' ){
            next();
        }


        return res.status(401).json({
            ok:false,
            err: {
                message: 'Rol no válido'
                
            }
        });
 
};


module.exports = {
    verificaToken,
    verificaRol
} 