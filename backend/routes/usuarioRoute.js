import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();
const ctrl = new UsuarioController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todos os usuários cadastrados'
    ctrl.listarUsuarios(req, res);
});

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter um usuário'
    ctrl.obterUsuario(req, res);
});

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadastrar um usuário'
    ctrl.cadastrarUsuario(req, res);
});

router.put("/", (req, res) => {
    // #swagger.summary = 'Alterar um usuário'
    ctrl.alterarUsuario(req, res);
});

router.delete("/:id", (req, res) => {
    // #swagger.summary = 'Excluir um usuário pelo id'
    ctrl.excluirUsuario(req, res);
});

export default router;
