import express from 'express';
import ImplementoController from '../controllers/implementoController.js'
import Autenticar from '../middlewares/autenticar.js';
import upload from '../middlewares/multer.js';

const router = express.Router();
const ctrl = new ImplementoController();
let auth = new Autenticar()

router.get('/', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todos os Implementos cadastradas'
    ctrl.listarImplementos(req, res)
})

router.get('/:id', auth.validar, (req, res) => {
    // #swagger.summary = 'Obter um implemento'
    ctrl.obterImplemento(req, res)
})

router.post('/cadastrar', auth.validar, upload, (req, res) => {
    // #swagger.summary = 'Cadsatrar Implementos'
    ctrl.cadastrarImplemento(req, res)
})

router.put("/", upload, auth.validar, (req, res) => {
    // #swagger.summary = 'Alterar um implemento'
    ctrl.alterarImplemento(req, res);
})

router.delete("/:id", auth.validar, (req, res) => {
    //#swagger.summary = 'Exclui um implemento pelo id'
    ctrl.excluirImplemento(req, res);
})

router.get('/obter/disponivel', auth.validar, (req, res) => {
    // #swagger.summary = 'Listar todas os implementos cadastradas disponíveis'
    ctrl.listarImplementosDisponiveis(req, res)
})

export default router;