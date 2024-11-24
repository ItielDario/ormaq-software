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

export default router;