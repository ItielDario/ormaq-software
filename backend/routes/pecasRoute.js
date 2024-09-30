import express from 'express';
import MaquinaController from '../controllers/maquinaController.js';

const router = express.Router();
const ctrl = new MaquinaController();

router.get('/', (req, res) => {
    // #swagger.summary = 'Listar todas as peças cadastradas'
    ctrl.listarMaquinas(req, res)
})

export default router;