import swaggerAutogen from "swagger-autogen";
import MaquinaModel from "./models/maquinaModel.js";

const doc = {
    info: {
        title: "ORMAQ Software",
        description: "Software da ORMAQ"
    },
    host: 'localhost:5000',
    components: {
        schemas: {
            MaquinaModel: new MaquinaModel ("0", "Trator", "2024-01-01", "Nova", "Trator de grande porte", "N", "0", "1").toJSON(),
        },
    }
}

const outputJson = "./swagger-output.json";
const routes = ['./server.js']

swaggerAutogen({openapi: '3.0.0'})(outputJson, routes, doc)
.then( async () => {
    await import('./server.js');
})