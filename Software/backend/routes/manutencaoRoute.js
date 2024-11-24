import express from 'express';
import manutencaoController from '../controllers/manutencaoController.js';
import Autenticar from '../middlewares/autenticar.js';

const router = express.Router();
const ctrl = new manutencaoController();
let auth = new Autenticar()

router.get('/', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as manutenções cadastradas'
    ctrl.listarManutencao(req, res);
});

router.get('/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Obter uma manutenção específica'
    ctrl.obterManutencao(req, res);
});

router.post('/cadastrar', auth.validar, (req, res) => {
    // #swagger.summary = 'Cadastrar uma nova manutenção'
    ctrl.cadastrarManutencao(req, res);
});

router.put("/", auth.validar, (req, res) => {
    // #swagger.summary = 'Alterar uma manutenção existente'
    ctrl.alterarManutencao(req, res);
});

router.delete("/:id", auth.validar, (req, res) => {
    // #swagger.summary = 'Excluir uma manutenção pelo id'
    ctrl.excluirManutencao(req, res);
});

router.put("/finalizar", auth.validar, (req, res) => {
    // #swagger.summary = 'Finaliza uma manutenção'
    ctrl.finalizarManutencao(req, res);
});

router.post("/historico", auth.validar, (req, res) => {
    // #swagger.summary = 'Busca o histórico de manutenções de um equipamento'
    ctrl.buscarHitorico(req, res);
});

export default router;
