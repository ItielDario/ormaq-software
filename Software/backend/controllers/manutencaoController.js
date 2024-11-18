import ManutencaoModel from "../models/manutencaoModel.js";
import MaquinaModel from "../models/maquinaModel.js";
import PecaModel from "../models/pecaModel.js";
import ImplementoModel from "../models/implementoModel.js";

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
            let { manDataInicio, manDescricao, maqEqpTipo, manEqpId} = req.body;
    
            if (manDataInicio && manDescricao && maqEqpTipo && manEqpId) {

                let maquina = new MaquinaModel();
                let peca = new PecaModel();
                let implemento= new ImplementoModel();

                let manPecId = maqEqpTipo === "Peça" ? manEqpId : null;
                let manImpId = maqEqpTipo === "Implemento" ? manEqpId : null;
                let manMaqId = maqEqpTipo === "Máquina" ? manEqpId : null;

                let manutencao = new ManutencaoModel(0, manDataInicio, null, manDescricao, null, manPecId, manImpId, manMaqId, 'Em Manutenção');
                let manutencaoId = await manutencao.gravar();
    
                if (manutencaoId) {
                    if (maqEqpTipo === "Máquina") { await maquina.atualizarStatus(manMaqId, 3) } 
                    else if (maqEqpTipo === "Peça") { await peca.atualizarStatus(manPecId, 3) } 
                    else if (maqEqpTipo === "Implemento") { await implemento.atualizarStatus(manImpId, 3) }

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
            let { manId, manDataInicio, manDescricao, maqEqpTipoNovo, manEqpIdNovo, maqEqpTipoAntigo, manEqpIdAntigo} = req.body;
    
            if (manId && manDataInicio && manDescricao && maqEqpTipoNovo && manEqpIdNovo && maqEqpTipoAntigo && manEqpIdAntigo) {

                let manPecId = maqEqpTipoNovo === "Peça" ? manEqpIdNovo : null;
                let manImpId = maqEqpTipoNovo === "Implemento" ? manEqpIdNovo : null;
                let manMaqId = maqEqpTipoNovo === "Máquina" ? manEqpIdNovo : null;

                let manutencao = new ManutencaoModel(manId, manDataInicio, null, manDescricao, null, manPecId, manImpId, manMaqId, 'Em Manutenção');
                let manutencaoId = await manutencao.gravar();

                let maquina = new MaquinaModel();
                let peca = new PecaModel();
                let implemento= new ImplementoModel();

                if (manutencaoId) {
                    // Altera o status so antigo equipamento para "Disponível"
                    if (maqEqpTipoAntigo === "Máquina") { await maquina.atualizarStatus(manEqpIdAntigo, 1) } 
                    else if (maqEqpTipoAntigo === "Peça") { await peca.atualizarStatus(manEqpIdAntigo, 1) } 
                    else if (maqEqpTipoAntigo === "Implemento") { await implemento.atualizarStatus(manEqpIdAntigo, 1) }

                    // Altera o status so antigo equipamento para "Em Manutenção"
                    if (maqEqpTipoNovo === "Máquina") { await maquina.atualizarStatus(manEqpIdNovo, 3) } 
                    else if (maqEqpTipoNovo === "Peça") { await peca.atualizarStatus(manEqpIdNovo, 3) } 
                    else if (maqEqpTipoNovo === "Implemento") { await implemento.atualizarStatus(manEqpIdNovo, 3) }

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
            let manutencaoEquipamento = await manutencao.obter(id);
            let manutencaoResult = await manutencao.excluir(id);

            let maquina = new MaquinaModel();
            let peca = new PecaModel();
            let implemento= new ImplementoModel();

            if (manutencaoResult) {
                if (manutencaoEquipamento[0].maqEqpTipo === "Máquina") { await maquina.atualizarStatus(manutencaoEquipamento[0].manEqpId, 1) } 
                else if (manutencaoEquipamento[0].maqEqpTipo === "Peça") { await peca.atualizarStatus(manutencaoEquipamento[0].manEqpId, 1) } 
                else if (manutencaoEquipamento[0].maqEqpTipo === "Implemento") { await implemento.atualizarStatus(manutencaoEquipamento[0].manEqpId, 1) }

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
            let { manId, manObservacao, manDataTermino, maqEqpTipo, manEqpId} = req.body;
    
            if (manId && manDataTermino && maqEqpTipo && manEqpId) {

                let maquina = new MaquinaModel();
                let peca = new PecaModel();
                let implemento= new ImplementoModel();

                let manPecId = maqEqpTipo === "Peça" ? manEqpId : null;
                let manImpId = maqEqpTipo === "Implemento" ? manEqpId : null;
                let manMaqId = maqEqpTipo === "Máquina" ? manEqpId : null;

                let manutencao = new ManutencaoModel(manId, null, manDataTermino, null, manObservacao, null, null, null, 'Finalizada');
                let manutencaoId = await manutencao.finalizar();
    
                if (manutencaoId) {
                    if (maqEqpTipo === "Máquina") { await maquina.atualizarStatus(manMaqId, 1) } 
                    else if (maqEqpTipo === "Peça") { await peca.atualizarStatus(manPecId, 1) } 
                    else if (maqEqpTipo === "Implemento") { await implemento.atualizarStatus(manImpId, 1) }

                    res.status(201).json({ msg: "Manutenção finalizada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a finalização da manutenção." });
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
