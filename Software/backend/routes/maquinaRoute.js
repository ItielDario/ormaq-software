import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';
import Autenticar from '../middlewares/autenticar.js';
import upload from '../middlewares/multer.js';


const router = express.Router();
const ctrl = new MaquinaController();
let auth = new Autenticar();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas cadastradas'
    ctrl.listarMaquinas(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Buscar Máquina'
    ctrl.obterMaquina(req, res)
})

router.post('/cadastrar', upload, (req, res) => {
    //#swagger.summary = 'Cadastrar uma maquina'
    ctrl.cadastrarMaquina(req, res);
  });

router.put("/", upload, (req, res) => {
    //#swagger.summary = 'Alterar uma maquina existente'
    ctrl.alterarMaquina(req, res);
})

router.delete("/:id", (req, res) => {
    //#swagger.summary = 'Exclui uma máquina pelo id'
    ctrl.excluirMaquina(req, res);
})

router.get('/obter/disponivel', (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas cadastradas disponíveis'
    ctrl.listarMaquinasDisponiveis(req, res)
})

router.get('/obter/locacao/:id', (req, res) => {
    // #swagger.summary = 'Listar todas as máquinas que estão alugadas em uma determinada locação'
    ctrl.listarMaquinasDaLocacao(req, res)
})

export default router;