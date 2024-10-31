import LocacaoModel from "../models/locacaoModel.js";
import ItensLocacaoModel from "../models/itensLocacaoModel.js";

export default class locacaoController {
    
    async listarLocacao(req, res) {
        try {
            let locacao = new LocacaoModel();
            locacao = await locacao.listarLocacoes(); // Método para listar todas as locações
            res.status(200).json(locacao);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async obterLocacao(req, res) {
        try {
            let { id } = req.params;
            let locacao = new LocacaoModel();
            locacao = await locacao.obter(id);

            if (locacao == null) {
                res.status(404).json({ msg: `Locação com o ID ${id} não encontrada!` });
            } else {
                res.status(200).json(locacao[0]);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarLocacao(req, res) {
        try {
            let { locDataInicio, locDataFinalPrevista, locValorTotal, locDesconto, locValorFinal, locCliId, itens } = req.body;
    
            if (locDataInicio && locDataFinalPrevista && locValorTotal && locDesconto && locValorFinal && locCliId && itens && itens.length > 0) {
                let locacao = new LocacaoModel(0, locDataInicio, locDataFinalPrevista, null, locValorTotal, locDesconto, locValorFinal, locCliId, 1, 1);
                let locacaoResult = await locacao.gravar();
    
                if (locacaoResult) {
                    // Cadastra cada item individualmente
                    for (const item of itens) {
                        const { quantidade, preco, tipo, id } = item;
    
                        // Define os IDs específicos com base no tipo do item
                        let iteLocPecId = tipo === "Peça" ? id : null;
                        let iteLocImpId = tipo === "Implemento" ? id : null;
                        let iteLocMaqId = tipo === "Máquina" ? id : null;
    
                        let itemLocacao = new ItensLocacaoModel(0, quantidade, preco, iteLocPecId, iteLocImpId, iteLocMaqId, locacaoResult);
    
                        const itemResult = await itemLocacao.gravar();
                        if (!itemResult) {
                            throw new Error(`Erro ao cadastrar item de locação: ${item.nome}`);
                        }
                    }
    
                    res.status(201).json({ msg: "Locação cadastrada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro da locação." });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item de locação!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarLocacao(req, res) {
        try {
            let {locDataInicio, locDataFinalPrevista, locValorTotal, locDesconto, locValorFinal, locCliId, itens} = req.body;

            if (locDataInicio && locDataFinalPrevista && locValorTotal && locDesconto && locValorFinal && locCliId && itens) {
                let locacao = new LocacaoModel(0, locDataInicio, locDataFinalPrevista, null, locValorTotal, locDesconto, locValorFinal, locCliId, 1, 1);
                let result = await locacao.gravar();

                if (result) {
                    res.status(200).json({ msg: "Locação alterada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração da locação" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirLocacao(req, res) {
        try {
            let { id } = req.params;
            let locacao = new LocacaoModel();

            let result = await locacao.excluir(id);

            if (result) {
                res.status(200).json({ msg: `Locação excluída com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão da locação" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}