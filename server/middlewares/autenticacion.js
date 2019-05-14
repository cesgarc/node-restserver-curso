const jwt = require('jsonwebtoken');

//Verificando el Token

//====================
// Verificar Token
//====================

let verificaToken = (req, res, next)=>{
    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, (err, decoded)=> {
        if (err){
            return res.status(401).json({
                ok: false,
                err:{
                    message:'Token NO Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//====================
// Verifica AdminRole
//====================

let verificaAdmin_Role = (req, res, next)=>{
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE'){
        next();
    }
    else{
        return res.json({
            ok: false,
            err:{
                message:'Usuario NO es Admnistrador'
            }
        });
    }
};

//====================
// Verifica Token del URL
//====================

let verificaTokenImg = (req, res, next)=> {
    let token = req.query.token;
    jwt.verify( token, process.env.SEED, (err, decoded)=> {
        if (err){
            return res.status(401).json({
                ok: false,
                err:{
                    message:'Token NO Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};