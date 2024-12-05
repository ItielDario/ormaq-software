import express from 'express';
import LoginController from '../controllers/loginController.js'

let router = express.Router();
let ctrl = new LoginController()

router.post('/', (req, res) => {
    // #swagger.summary = "Gerar token de acesso e fazer login"
    ctrl.autenticar(req, res);
});

router.get('/logout', (req,res) => {
    // #swagger.summary = "Limpar token e deslogar"
    ctrl.logout(req,res)
})

router.post('/buscar', (req, res) => {
    // #swagger.summary = "Buscar email pelo nome de usuário"
    ctrl.buscarEmail(req, res);
});

router.post('/validar-codigo', (req, res) => {
    // #swagger.summary = "Buscar email pelo nome de usuário"
    ctrl.validarCodigo(req, res);
});

export default router;