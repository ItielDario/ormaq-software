import express from 'express';
import ClienteController from '../controllers/clienteController.js'
import Autenticar from '../middlewares/autenticar.js';

const router = express.Router();
const ctrl = new ClienteController();
let auth = new Autenticar()

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas os clientes cadastradas'
    ctrl.listarClientes(req, res)
})

router.get('/:id', (req, res) => {
    // #swagger.summary = 'Obter um cliente'
    ctrl.obterCliente(req, res)
})

router.post('/cadastrar', (req, res) => {
    // #swagger.summary = 'Cadsatrar um cliente'
    ctrl.cadastrarCliente(req, res)
})

router.put("/", (req, res) => {
    // #swagger.summary = 'Alterar um cliente'
    ctrl.alterarCliente(req, res);
})

router.delete("/:id", (req, res) => {
    //#swagger.summary = 'Exclui um cliente pelo id'
    ctrl.excluirCliente(req, res);
})

export default router;