import ManutencaoModel from "../models/manutencaoModel.js";

export default class manutencaoController {
    
    async listarManutencao(req, res) {
        try {
            let manutencao = new ManutencaoModel();
            manutencao = await manutencao.listarManutencoes(); // Método para listar todas as manutenções
            res.status(200).json(manutencao);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async obterManutencao(req, res) {
        try {
            let { id } = req.params;
            let manutencao = new ManutencaoModel();
            manutencao = await manutencao.obter(id);

            if (!manutencao) {
                res.status(404).json({ msg: `Manutenção com o ID ${id} não encontrada!` });
            } else {
                res.status(200).json(manutencao);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarManutencao(req, res) {
        try {
            let { manDataInicio, manDecricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId } = req.body;
    
            if (manDataInicio && manDecricao && manStatus) {
                let manutencao = new ManutencaoModel(0, manDataInicio, manDecricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId);
                let manutencaoId = await manutencao.gravar();
    
                if (manutencaoId) {
                    res.status(201).json({ msg: "Manutenção cadastrada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro da manutenção." });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarManutencao(req, res) {
        try {
            let { manId, manDataInicio, manDecricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId } = req.body;
    
            if (manId && manDataInicio && manDecricao && manStatus) {
                let manutencao = new ManutencaoModel(manId, manDataInicio, manDecricao, manDataTermino, manObservacao, manStatus, manMaqId, manImpId, manPecId);
                let manutencaoId = await manutencao.gravar();
    
                if (manutencaoId) {
                    res.status(200).json({ msg: "Manutenção alterada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração da manutenção!" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirManutencao(req, res) {
        try {
            let { id } = req.params;

            let manutencao = new ManutencaoModel();
            let manutencaoResult = await manutencao.excluir(id);

            if (manutencaoResult) {
                res.status(200).json({ msg: `Manutenção excluída com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão da manutenção" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}
