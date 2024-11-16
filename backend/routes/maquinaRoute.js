import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';
import Autenticar from '../middlewares/autenticar.js';

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

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadsatrar máquinas'
    ctrl.cadastrarMaquina(req, res)
})

router.put("/", (req, res) => {
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

export default router;