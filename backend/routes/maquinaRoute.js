import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';

const router = express.Router();
const ctrl = new MaquinaController();

router.get('/', (req, res) => {
    // #swagger.tags = ['Máquina']
    // #swagger.summary = 'Listar todos as máquinas cadastradas'
    ctrl.listarMaquinas(req, res)
})

export default router;