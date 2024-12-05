import express from 'express';
import PecaController from '../controllers/pecaController.js'
import Autenticar from '../middlewares/autenticar.js';
import upload from '../middlewares/multer.js';

const router = express.Router();
const ctrl = new PecaController();
let auth = new Autenticar()

router.get('/', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas'
    ctrl.listarPeca(req, res)
})

router.get('/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Obter uma peça'
    ctrl.obterPeca(req, res)
})

router.post('/cadastrar', auth.validar, upload, (req, res) => {
    // #swagger.summary = 'Cadsatrar uma peça'
    ctrl.cadastrarPeca(req, res)
})

router.put("/", auth.validar, upload, (req, res) => {
    // #swagger.summary = 'Alterar uma peça'
    ctrl.alterarPeca(req, res);
})

router.delete("/:id", auth.validar, (req, res) => {
    //#swagger.summary = 'Exclui uma peça pelo id'
    ctrl.excluirPeca(req, res);
})

router.get('/obter/disponivel', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas disponíveis'
    ctrl.listarPecasDisponiveis(req, res)
})

router.put('/exibir/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Exibir ou deixar de exibir uma peça nos classificados'
    ctrl.exibicaoClassificados(req, res)
})

router.get('/obter/exibir-classificados', (req, res) => {
    // #swagger.summary = 'Listar as peça que são para exibir nos classificados'
    ctrl.listarPecasParaExibicao(req, res)
})

router.get('/obter/exibir-classificados/:id', (req, res) => {
    // #swagger.summary = 'Busca uma peça pelo no id que está disponível para exibir nos classificados'
    ctrl.buscaPecaExibir(req, res)
})

export default router;