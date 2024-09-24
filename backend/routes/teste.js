import express from 'express';
import teste from '../controllers/teste.js';

const router = express.Router();
const ctrl = new teste();

router.get('/', (req, res) => {
    ctrl.testando(req, res)
})

export default router;