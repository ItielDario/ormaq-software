import PecaModel from "../models/pecaModel.js" 

export default class pecaController {
    async listarPeca(req, res){
        try{
            let peca = new PecaModel()
            peca = await peca.listarPecas()
            res.status(200).json(peca);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async obterPeca(req, res) {
        try{
            let { id } = req.params;
            let peca = new PecaModel();
            peca = await peca.obter(id);

            if(peca == null) {
                res.staus(404).json({msg: `Peça com o id ${id} não encontrada!`})
            }
            else{
                res.status(200).json(peca);
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async cadastrarPeca(req, res) {
        try {
            let { pecaNome, pecaDataAquisicao, pecaDescricao, pecaInativo, equipamentoStatus} = req.body;

            if(pecaNome != "" && pecaDataAquisicao != "" && pecaDescricao != "" && pecaInativo != "" && equipamentoStatus != "") {
                let peca = new PecaModel(0, pecaNome, pecaDescricao, pecaDataAquisicao, equipamentoStatus, pecaInativo);

                let result  = await peca.gravar();

                if(result) {
                    res.status(201).json({msg: "Peça cadastrada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro durante o cadastro da Peça"});
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