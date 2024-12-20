import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';
import Autenticar from '../middlewares/autenticar.js';
import upload from '../middlewares/multer.js';


const router = express.Router();
const ctrl = new MaquinaController();
let auth = new Autenticar();

router.get('/', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas cadastradas'
    ctrl.listarMaquinas(req, res)
})

router.get('/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Buscar Máquina'
    ctrl.obterMaquina(req, res)
})

router.post('/cadastrar', auth.validar, upload, (req, res) => {
    //#swagger.summary = 'Cadastrar uma maquina'
    ctrl.cadastrarMaquina(req, res);
  });

router.put("/", auth.validar, upload, (req, res) => {
    //#swagger.summary = 'Alterar uma maquina existente'
    ctrl.alterarMaquina(req, res);
})

router.delete("/:id", auth.validar, (req, res) => {
    //#swagger.summary = 'Exclui uma máquina pelo id'
    ctrl.excluirMaquina(req, res);
})

router.get('/obter/disponivel', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas cadastradas disponíveis'
    ctrl.listarMaquinasDisponiveis(req, res)
})

router.get('/obter/locacao/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas que estão alugadas em uma determinada locação'
    ctrl.listarMaquinasDaLocacao(req, res)
})

router.put('/exibir/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Exibir ou deixar de exibir uma máquina nos classificados'
    ctrl.exibicaoClassificados(req, res)
})

router.get('/obter/exibir-classificados', (req, res) => {
    // #swagger.summary = 'Listar as máquinas que são para exibir nos classificados'
    ctrl.listarMaquinasParaExibicao(req, res)
})

router.get('/obter/exibir-classificados/:id', (req, res) => {
    // #swagger.summary = 'Busca uma máquina pelo no id que está disponível para exibir nos classificados'
    ctrl.buscaMaquinaExibir(req, res)
})

export default router;