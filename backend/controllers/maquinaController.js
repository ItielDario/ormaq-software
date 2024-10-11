import MaquinaModel from "../models/maquinaModel.js"

export default class maquinaController {
    async listarMaquinas(req, res){
        try{
            let maquinas = new MaquinaModel()
            maquinas = await maquinas.listarMaquinas()
            res.status(200).json(maquinas);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async cadastrarMaquina(req, res) {
        try {
            console.log(req.body)
            let { maqNome, maqDataAquisicao, maqTipo, maqHorasUso, equipamentoStatus, maqInativo, maqDescricao} = req.body;

            if(maqNome != "" && maqDataAquisicao != "" && maqTipo != "" && maqHorasUso != "" && equipamentoStatus != "" && maqInativo != "" && maqDescricao != "") {
                if(parseFloat(maqHorasUso) > 0) {
                    let maquina = new MaquinaModel(0, maqNome, maqDataAquisicao, maqTipo, maqHorasUso, equipamentoStatus, maqInativo, maqDescricao);

                    let result  = await maquina.gravar();
                    
                    if(result) {
                        res.status(201).json({msg: "Máquina cadastrada com sucesso!"});
                    }
                    else {
                        res.status(500).json({msg: "Erro durante o cadastro da Máquina"});
                    }
                }
                else {
                    res.status(400).json({msg: "A hora de uso não pode ser negativa!"});
                }
            }
            else {
                res.status(400).json({msg: "Por favor, preencha os campos abaixo corretamente!"});
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }
}