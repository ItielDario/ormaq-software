import LocacaoModel from "../models/locacaoModel.js";

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
            let { locDataInicio, locDataFinalPrevista, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus } = req.body;

            if (locDataInicio && locDataFinalPrevista && locValorTotal && locCliId && locUsuId && locStatus) {
                let locacao = new LocacaoModel(0, locDataInicio, locDataFinalPrevista, null, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus);

                let result = await locacao.gravar();

                if (result) {
                    res.status(201).json({ msg: "Locação cadastrada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro da locação" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarLocacao(req, res) {
        try {
            let { locId, locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus } = req.body;

            if (locId && locDataInicio && locDataFinalPrevista && locValorTotal && locCliId && locUsuId && locStatus) {
                let locacao = new LocacaoModel(locId, locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus);

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