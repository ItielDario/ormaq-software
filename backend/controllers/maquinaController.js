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

    async obterMaquina(req, res) {
        try{
            let { id } = req.params;
            let maquina = new MaquinaModel();
            maquina = await maquina.obter(id);

            if(maquina == null) {
                res.staus(404).json({msg: `Maquina com o id ${id} não encontrada!`})
            }
            else{
                res.status(200).json(maquina);
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async cadastrarMaquina(req, res) {
        try {
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

    async alterarMaquina(req, res) {
        try {
            let { maqId, maqNome, maqDataAquisicao, maqTipo, maqHorasUso, maqDescricao} = req.body;

            if(maqId != "" && maqNome != "" && maqDataAquisicao != "" && maqTipo != "" && maqHorasUso != "" && maqDescricao != "") {
                if(parseFloat(maqHorasUso) > 0) {
                    let maquina = new MaquinaModel(maqId, maqNome, maqDataAquisicao, maqTipo, maqHorasUso, '', '', maqDescricao);

                    let result  = await maquina.gravar();

                    if(result) {
                        res.status(201).json({msg: "Máquina alterada com sucesso!"});
                    }
                    else {
                        res.status(500).json({msg: "Erro durante o alteração da máquina"});
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