// CONFIGURAÇÕES GERAIS
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import outputJson from "./swagger-output.json" assert { type: "json" };
import cors from 'cors';

// ROTAS
import MaquinaRoute from './routes/maquinaRoute.js';
import PecasRoute from './routes/pecasRoute.js';

const app = express();
app.listen(5000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/maquina', 
    // #swagger.tags = ['Maquina']
    // #swagger.description = 'Lista todas as máquinas.'
    MaquinaRoute
);
app.use('/peca', 
    // #swagger.tags = ['Peças']
    PecasRoute
);
