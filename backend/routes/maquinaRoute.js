import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';

const router = express.Router();
const ctrl = new MaquinaController();

router.get('/', (req, res) => {
    // #swagger.tags = ['Máquina']
    // #swagger.summary = 'Listar todas as máquinas cadastradas'
    ctrl.listarMaquinas(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.tags = ['Máquina']
    // #swagger.summary = 'Cadsatrar máquinas'
    ctrl.cadastrarMaquina(req, res)
})

export default router;