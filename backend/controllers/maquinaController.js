import MaquinaModel from "../models/maquinaModel.js"

export default class maquinaController {
    async listarMaquinas(req, res){
        try{
            let maquinas = new MaquinaModel()
            maquinas = await maquinas.listarMaquinas()

            console.log(maquinas);
            res.status(200).json(maquinas);
        }
        catch(error){
            res.status(500).json(error)
        }
    }
}