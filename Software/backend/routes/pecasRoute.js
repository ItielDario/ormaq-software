import express from 'express';
import PecaController from '../controllers/pecaController.js'
import Autenticar from '../middlewares/autenticar.js';
import upload from '../middlewares/multer.js';

const router = express.Router();
const ctrl = new PecaController();
let auth = new Autenticar()

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas'
    ctrl.listarPeca(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter uma peça'
    ctrl.obterPeca(req, res)
})

router.post('/cadastrar', upload, (req, res) => {
    // #swagger.summary = 'Cadsatrar uma peça'
    ctrl.cadastrarPeca(req, res)
})

router.put("/", upload, (req, res) => {
    // #swagger.summary = 'Alterar uma peça'
    ctrl.alterarPeca(req, res);
})

router.delete("/:id", (req, res) => {
    //#swagger.summary = 'Exclui uma peça pelo id'
    ctrl.excluirPeca(req, res);
})

router.get('/obter/disponivel', (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas disponíveis'
    ctrl.listarPecasDisponiveis(req, res)
})

export default router;