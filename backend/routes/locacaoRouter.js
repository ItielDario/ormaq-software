import express from 'express';
import locacaoController from '../controllers/locacaoController.js'

const router = express.Router();
const ctrl = new locacaoController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as locações cadastradas'
    ctrl.listarLocacao(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter uma locação'
    ctrl.obterLocacao(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadsatrar uma locação'
    ctrl.cadastrarLocacao(req, res)
})

router.put("/", (req, res) => {
    // #swagger.summary = 'Alterar uma locação'
    ctrl.alterarLocacao(req, res);
})

router.delete("/:id", (req, res) => {
    //#swagger.summary = 'Exclui uma locação pelo id'
    ctrl.excluirLocacao(req, res);
})

export default router;