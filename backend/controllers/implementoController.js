import ImplementoModel from "../models/implementoModel.js"

export default class implementoController {
    async listarImplementos(req, res){
        try{
            let implemento = new ImplementoModel()
            implemento = await implemento.listarImplementos()
            res.status(200).json(implemento);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async cadastrarImplemento(req, res) {
        try {
            let { impNome, impDataAquisicao, impDescricao, impInativo, equipamentoStatus} = req.body;

            if(impNome != "" && impDataAquisicao != "" && impDescricao != "" && impInativo != "" && equipamentoStatus != "") {
                let implemento = new ImplementoModel(0, impNome, impDescricao, impDataAquisicao, equipamentoStatus, impInativo);

                let result  = await implemento.gravar();

                if(result) {
                    res.status(201).json({msg: "Implemento cadastrado com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro durante o cadastro do implemento"});
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