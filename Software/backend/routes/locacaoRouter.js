import express from 'express';
import locacaoController from '../controllers/locacaoController.js'
import Autenticar from '../middlewares/autenticar.js';

const router = express.Router();
const ctrl = new locacaoController();
let auth = new Autenticar()

router.get('/', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as locações cadastradas'
    ctrl.listarLocacao(req, res)
})

router.get('/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Obter uma locação'
    ctrl.obterLocacao(req, res)
})

router.post('/cadastrar', auth.validar, (req, res) => {
    // #swagger.summary = 'Cadsatrar uma locação'
    ctrl.cadastrarLocacao(req, res)
})

router.put("/", auth.validar, (req, res) => {
    // #swagger.summary = 'Alterar uma locação'
    ctrl.alterarLocacao(req, res);
})

router.delete("/:id", auth.validar, (req, res) => {
    //#swagger.summary = 'Exclui uma locação pelo id'
    ctrl.excluirLocacao(req, res);
})

router.put("/finalizar", auth.validar, (req, res) => {
    // #swagger.summary = 'Finaliza uma locação'
    ctrl.finalizarLocacao(req, res);
});

export default router;