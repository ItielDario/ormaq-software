import express from 'express';
import PecaController from '../controllers/pecaController.js'

const router = express.Router();
const ctrl = new PecaController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas'
    ctrl.listarPeca(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.tags = ['Peças']
    // #swagger.summary = 'Cadsatrar peças'
    ctrl.cadastrarPeca(req, res)
})

export default router;