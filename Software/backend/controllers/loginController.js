import Autenticar from "../middlewares/autenticar.js";
import LoginModel from "../models/loginModel.js";
import nodemailer from 'nodemailer'; // Importação do nodemailer

export default class LoginController {

    async autenticar(req, res) {
        try{
            let { usuEmail, usuSenha } = req.body;

            if(usuEmail != "" || usuSenha != "") {

                let usuario = new LoginModel(usuEmail, usuSenha)
                let usuarioExiste = await usuario.autenticar()

                if(usuarioExiste) {
                    usuario.usuSenha = "";

                    let auth = new Autenticar();
                    let token = auth.gerarToken(usuario.toJSON())
                    
                    res.cookie("jwt", token, { httpOnly: true })

                    res.status(200).json({tokenAcesso: token, usuario: usuario});
                }
                else {
                    res.status(404).json({msg: "E-mail ou senha inválidos"});
                }
            }
            else {
                res.status(400).json({msg: "E-mail ou senha não informados"});
            } 
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor"});
        }
    }

    async logout(req,res){
        try {
            res.clearCookie("jwt", {
                httpOnly:true,
                secure:true,
                sameSite:'strict'
            })
            res.status(200).json({msg: "Logout realizado"})
        } catch (error) {
            res.status(500).json({msg: "Erro ao Deslogar"})
        }
    }

    async buscarEmail(req, res) {
        try{
            let { usuEmail } = req.body;

            if(usuEmail != "") {             
                
                let usuario = new LoginModel(usuEmail)
                let usuarioExiste = await usuario.buscarEmail()

                if(usuarioExiste) {
                    const codigo = Math.floor(1000 + Math.random() * 9000); 
                    const result = await usuario.gravarRecuperacaoSenha(usuarioExiste.usuId, codigo, new Date())

                    const corpoHtml = `
                                        <h1>Recuperação de Senha</h1>
                                        <p>Olá <strong>${usuarioExiste.usuNome}</strong>,</p>
                                        <p>Recebemos uma solicitação para redefinir a senha da sua conta em nosso sistema.</p>
                                        <h2>Seu código de verificação:</h2>
                                        <h1>[ ${codigo} ]</h1>
                                        <p>Por favor, insira este código no formulário de recuperação de senha para prosseguir.</p>
                                        <p>Caso você não tenha solicitado a redefinição de senha, ignore este e-mail.</p>
                                        <p>Atenciosamente,</p>
                                        <p>ORMAQ</p>`;

                    
                    // Configuração do transportador de e-mail
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'itiel.dario@gmail.com', // Seu e-mail
                            pass: 'kpdq osow fhtj cohj' // Sua senha ou app password
                        }
                    });

                    // Detalhes do e-mail
                    let mailOptions = {
                        from: 'itiel.dario@gmail.com', // Endereço de e-mail do remetente
                        to: usuEmail,
                        subject: "Código de Verificação para Recuperação de Senha",
                        html: corpoHtml
                    };

                    // Enviar e-mail
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('E-mail enviado: ' + info.response);
                    });

                    res.status(200).json({usuId: usuarioExiste.usuId});
                }
                else {
                    res.status(404).json({msg: "E-mail inválido"});
                }
            }
            else {
                res.status(400).json({msg: "E-mail não informado"});
            } 
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor"});
        }
    }

    async validarCodigo(req, res) {
        try{
            let { usuId, codigo } = req.body;

            if(usuId != "" || codigo != "") {

                let usuario = new LoginModel()
                let result = await usuario.validarCodigo(usuId)

                if(result) {

                    if(result.recSenCodigo == codigo){
                        res.status(200).json({usuId});
                    }
                    else {
                        res.status(404).json({msg: "Código inválido!"});
                    } 
                }
                else {
                    res.status(404).json({msg: "E-mail inválido!"});
                }
            }
            else {
                res.status(400).json({msg: "Erro desconhecido!"});
            } 
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor"});
        }
    }

    async redefinirSenha(req, res) {
        try{
            let { usuId, novaSenha } = req.body;

            if(usuId != "" && novaSenha != "") {

                let usuario = new LoginModel()
                let resultSenha = await usuario.atualizarSenha(novaSenha, usuId)
                let resultDataExpiracao = await usuario.atualizarDataExpiracao(new Date(), usuId)

                if(resultSenha && resultDataExpiracao) {
                    res.status(200).json({msg: "Senha alterada com sucesso!"});  
                }
                else {
                    res.status(404).json({msg: "Erro ao redefinir senha!"});
                }
            }
            else {
                res.status(400).json({msg: "Erro desconhecido!"});
            } 
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor"});
        }
    }
}