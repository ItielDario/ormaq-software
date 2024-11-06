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
                res.status(200).json(manutencao[0]);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarManutencao(req, res) {
        try {
            let { manDataInicio, manDescricao, manMaqTipo, manEqpId} = req.body;
    
            if (manDataInicio && manDescricao && manMaqTipo && manEqpId) {

                let manPecId = manMaqTipo === "Peça" ? manEqpId : null;
                let manLocImpId = manMaqTipo === "Implemento" ? manEqpId : null;
                let manLocMaqId = manMaqTipo === "Máquina" ? manEqpId : null;

                let manutencao = new ManutencaoModel(0, manDataInicio, null, manDescricao, null, manPecId, manLocImpId, manLocMaqId, 'Em Manutenção');
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
            let { manId, manDataInicio, manDescricao, manMaqTipo, manEqpId} = req.body;
    
            if (manId && manDataInicio && manDescricao && manMaqTipo && manEqpId) {

                let manPecId = manMaqTipo === "Peça" ? manEqpId : null;
                let manLocImpId = manMaqTipo === "Implemento" ? manEqpId : null;
                let manLocMaqId = manMaqTipo === "Máquina" ? manEqpId : null;

                let manutencao = new ManutencaoModel(manId, manDataInicio, null, manDescricao, null, manPecId, manLocImpId, manLocMaqId, 'Em Manutenção');
                let manutencaoId = await manutencao.gravar();
    
                if (manutencaoId) {
                    res.status(201).json({ msg: "Manutenção alterada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração da manutenção." });
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

    async finalizarManutencao(req, res) {
        try {
            let { manId, manObservacao, manDataTermino} = req.body;
    
            if (manId && manDataTermino) {

                let manutencao = new ManutencaoModel(manId, null, manDataTermino, null, manObservacao, null, null, null, 'Finalizada');
                let manutencaoId = await manutencao.finalizar();
    
                if (manutencaoId) {
                    res.status(201).json({ msg: "Manutenção finalizada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a filanização da manutenção." });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}
