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

            // if(imovelDescricao != "" && imovelValor != "" && imovelCep != "" && imovelEndereco != "" && imovelBairro != "" && imovelCidade != "" && imovelUf != "" && imovelDisponivel != "") {
            //     if(parseFloat(imovelValor) > 0) {
            //         let imovel = new ImovelModel(0, imovelDescricao, imovelValor, imovelCep, imovelEndereco, imovelBairro, imovelCidade, imovelUf, imovelDisponivel);

            //         let result  = await imovel.gravar();

            //         if(result) {
            //             res.status(201).json({msg: "Imóvel cadastrado com sucesso!"});
            //         }
            //         else {
            //             res.status(500).json({msg: "Erro durante o cadastro do imóvel"});
            //         }
            //     }
            //     else {
            //         res.status(400).json({msg: "O valor não pode ser negativo!"});
            //     }
            // }
            // else {
            //     res.status(400).json({msg: "Preencha corretamente os valores necessários!"});
            // }
        }
        catch(ex) {
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }
}