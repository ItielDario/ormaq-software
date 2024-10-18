import express from 'express';
import ImplementoController from '../controllers/implementoController.js'

const router = express.Router();
const ctrl = new ImplementoController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todos os Implementos cadastradas'
    ctrl.listarImplementos(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.tags = ['Implemento']
    // #swagger.summary = 'Obter um implemento'
    ctrl.obterImplemento(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.tags = ['Implemento']
    // #swagger.summary = 'Cadsatrar Implementos'
    ctrl.cadastrarImplemento(req, res)
})

router.put("/", (req, res) => {
    // #swagger.tags = ['Implemento']
    // #swagger.summary = 'Alterar um implemento'
    ctrl.alterarImplemento(req, res);
})

export default router;