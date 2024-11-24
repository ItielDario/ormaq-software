import jwt from 'jsonwebtoken'
import UsuarioModel from '../models/usuarioModel.js'

const jwt_segredo = "SEGREDO12345"

export default class Autenticar {

    async validar(req, res, next) {
        
        if(req.cookies.jwt) {
            let token = "";
            
            try{
                token = req.cookies.jwt;
                let usuario = jwt.verify(token, jwt_segredo);

                let usuarioModel = new UsuarioModel();
                usuarioModel = await usuarioModel.obter(usuario.usuId);

                if(usuarioModel != null) {
                    req.usuario = usuarioModel;
                    next();
                }
                else{
                    res.status(401).json({msg: "Usuário inválido"});
                }
            }
            catch(ex) {
                if(ex.name == "TokenExpiredError") {
                    let usuarioRecuperado = jwt.verify(token, jwt_segredo, { ignoreExpiration: true })

                    //gera o token novamente e escreve na cookie de resposta
                    let auth = new Autenticar();
                    let novoToken = auth.gerarToken({
                        usuId: usuarioRecuperado.usuId,
                        usuEmail: usuarioRecuperado.usuEmail,
                        usuNome: usuarioRecuperado.usuNome,
                    })
                    
                    res.cookie("jwt", novoToken, {
                        httpOnly: true,
                    });
                    req.usuarioLogado = usuarioRecuperado;
                    next();
                }
                else{
                    res.status(401).json({msg: "Usuário não autorizado"})
                }   
            }
        }
        else{
            res.status(401).json({msg: "Usuário não autorizado"});
        }
    }

    gerarToken(usuario) {
        return jwt.sign(usuario, jwt_segredo, { expiresIn: 60 })
    }
}