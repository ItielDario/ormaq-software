import express from 'express';
import manutencaoController from '../controllers/manutencaoController.js';

const router = express.Router();
const ctrl = new manutencaoController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as manutenções cadastradas'
    ctrl.listarManutencao(req, res);
});

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter uma manutenção específica'
    ctrl.obterManutencao(req, res);
});

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadastrar uma nova manutenção'
    ctrl.cadastrarManutencao(req, res);
});

router.put("/", (req, res) => {
    // #swagger.summary = 'Alterar uma manutenção existente'
    ctrl.alterarManutencao(req, res);
});

router.delete("/:id", (req, res) => {
    // #swagger.summary = 'Excluir uma manutenção pelo id'
    ctrl.excluirManutencao(req, res);
});

router.put("/finalizar", (req, res) => {
    // #swagger.summary = 'Finaliza uma manutenção'
    ctrl.finalizarManutencao(req, res);
});

export default router;
