// CONFIGURAÇÕES GERAIS
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import outputJson from "./swagger-output.json" assert { type: "json" };
import cors from 'cors';

// ROTAS
import MaquinaRoute from './routes/maquinaRoute.js';
import PecasRoute from './routes/pecasRoute.js';
import ImplementoRoute from './routes/implementoRoute.js';
import LocacaoRoute from './routes/locacaoRouter.js';
import ClienteRoute from './routes/clienteRoute.js';
import ManuetencaoRoute from './routes/manutencaoRoute.js';

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

app.use('/implemento', 
    // #swagger.tags = ['Implementos']
    ImplementoRoute
);

app.use('/locacao', 
    // #swagger.tags = ['Locações']
    LocacaoRoute
);

app.use('/cliente', 
    // #swagger.tags = ['Clientes']
    ClienteRoute
);

app.use('/manutencao', 
    // #swagger.tags = ['Manutenção']
    ManuetencaoRoute
);