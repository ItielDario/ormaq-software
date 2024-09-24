const express = require('express');

const app = express();

// CONFIGURAÇÕES
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());


// ROTAS
const loginRouter = new LoginRoute();
app.use('/login', loginRouter.router);

app.listen(3000, () => {
    console.log('Servidor iniciado');
});

//teste