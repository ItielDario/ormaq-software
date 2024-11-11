import express from 'express';
import ImplementoController from '../controllers/implementoController.js'

const router = express.Router();
const ctrl = new ImplementoController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todos os Implementos cadastradas'
    ctrl.listarImplementos(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter um implemento'
    ctrl.obterImplemento(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadsatrar Implementos'
    ctrl.cadastrarImplemento(req, res)
})

router.put("/", (req, res) => {
    // #swagger.summary = 'Alterar um implemento'
    ctrl.alterarImplemento(req, res);
})

router.delete("/:id", (req, res) => {
    //#swagger.summary = 'Exclui um implemento pelo id'
    ctrl.excluirImplemento(req, res);
})

router.get('/obter/disponivel', (req, res) => {
    // #swagger.summary = 'Listar todas os implementos cadastradas disponíveis'
    ctrl.listarImplementosDisponiveis(req, res)
})

export default router;