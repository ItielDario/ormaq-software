import express from 'express';
import teste from './routes/teste.js'

const app = express()

app.listen(5000)

app.get('/', (req, res) => {
    res.send("<h1>TA AIA CARAIO</h1>")
})

app.use('/teste', teste);