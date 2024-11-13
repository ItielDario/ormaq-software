import LocacaoModel from "../models/locacaoModel.js";
import ItensLocacaoModel from "../models/itensLocacaoModel.js";
import MaquinaModel from "../models/maquinaModel.js";
import PecaModel from "../models/pecaModel.js";
import ImplementoModel from "../models/implementoModel.js";

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

            let itensLocacao = new ItensLocacaoModel();
            itensLocacao = await itensLocacao.obter(id);

            if (locacao == null) {
                res.status(404).json({ msg: `Locação com o ID ${id} não encontrada!` });
            } else {
                res.status(200).json({locacao: locacao[0], itensLocacao:  itensLocacao});
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
                let locacaoId = await locacao.gravar();
    
                if (locacaoId) {
                    let maquina = new MaquinaModel();
                    let peca = new PecaModel();
                    let implemento= new ImplementoModel();

                    // Cadastra cada item individualmente
                    for (const item of itens) {
                        const { quantidade, preco, tipo, id } = item;
    
                        // Define os IDs específicos com base no tipo do item
                        let iteLocPecId = tipo === "Peça" ? id : null;
                        let iteLocImpId = tipo === "Implemento" ? id : null;
                        let iteLocMaqId = tipo === "Máquina" ? id : null;
    
                        let itemLocacao = new ItensLocacaoModel(0, quantidade, preco, iteLocPecId, iteLocImpId, iteLocMaqId, locacaoId);
    
                        const itemResult = await itemLocacao.gravar();
                        if (!itemResult) {
                            throw new Error(`Erro ao cadastrar item de locação: ${item.nome}`);
                        }

                        if (tipo === "Máquina") { await maquina.atualizarStatus(id, 2) } 
                        else if (tipo === "Peça") { await peca.atualizarStatus(id, 2) } 
                        else if (tipo === "Implemento") { await implemento.atualizarStatus(id, 2) }
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
            let { locId, locDataInicio, locDataFinalPrevista, locValorTotal, locDesconto, locValorFinal, locCliId, itens } = req.body;
    
            if (locId && locDataInicio && locDataFinalPrevista && locValorTotal && locDesconto && locValorFinal && locCliId && itens && itens.length > 0) {
                let locacao = new LocacaoModel(locId, locDataInicio, locDataFinalPrevista, null, locValorTotal, locDesconto, locValorFinal, locCliId, 1, 1);
                let locacaoId = await locacao.gravar();
    
                if (locacaoId) {
                    // Exclui todos os itens dessa locação
                    let maquina = new MaquinaModel();
                    let peca = new PecaModel();
                    let implemento= new ImplementoModel();

                    let intanciaAux = new ItensLocacaoModel();
                    const exclusaoResult = await intanciaAux.excluir(locId);

                    // Cadastra novamente cada item individualmente
                    for (const item of itens) {
                        const { iteLocQuantidade, iteLocValorUnitario, iteLocTipo, iteLocId } = item;

                        // Define os IDs específicos com base no tipo do item
                        let iteLocPecId = iteLocTipo === "Peça" ? iteLocId : null;
                        let iteLocImpId = iteLocTipo === "Implemento" ? iteLocId : null;
                        let iteLocMaqId = iteLocTipo === "Máquina" ? iteLocId : null;

                        let itemLocacao = new ItensLocacaoModel(0, iteLocQuantidade, iteLocValorUnitario, iteLocPecId, iteLocImpId, iteLocMaqId, locId);

                        const itemResult = await itemLocacao.gravar();
                        if (!itemResult) {
                            throw new Error(`Erro ao alterar item de locação: ${item.nome}`);
                        }

                        console.log(iteLocTipo)

                        if (iteLocTipo === "Máquina") { await maquina.atualizarStatus(iteLocId, 2) } 
                        else if (iteLocTipo === "Peça") { await peca.atualizarStatus(iteLocId, 2) } 
                        else if (iteLocTipo === "Implemento") { await implemento.atualizarStatus(iteLocId, 2) }
                    }

                    res.status(201).json({ msg: "Locação alterada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração da locação!" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item de locação!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirLocacao(req, res) {
        try {
            let { id } = req.params;

            let itemLocacao = new ItensLocacaoModel();
            let itemLocacaoLista = await itemLocacao.obter(id);
            let itemLocacaoResult = await itemLocacao.excluir(id);

            let locacao = new LocacaoModel();
            let locacaoResult = await locacao.excluir(id);

            let maquina = new MaquinaModel();
            let peca = new PecaModel();
            let implemento= new ImplementoModel();

            for (const item of itemLocacaoLista) {
                const { iteLocTipo, iteLocId } = item;

                if (iteLocTipo === "Máquina") { await maquina.atualizarStatus(iteLocId, 1) } 
                else if (iteLocTipo === "Peça") { await peca.atualizarStatus(iteLocId, 1) } 
                else if (iteLocTipo === "Implemento") { await implemento.atualizarStatus(iteLocId, 1) }
            }

            if (locacaoResult && itemLocacaoResult) {
                res.status(200).json({ msg: `Locação excluída com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão da locação" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async finalizarLocacao(req, res) {
        // console.log(req.body); 
        try {
            let { locId, locDataFinalEntrega, maqHorasUso, itensLocacao } = req.body;
            
            if (locId && locDataFinalEntrega && maqHorasUso && itensLocacao) {
    
                let locacao = new LocacaoModel(locId, null, null, locDataFinalEntrega, null, null, null, null, null, 2);
                let result = await locacao.finalizar();
                
                if (result) {
                    
                    let maquina = new MaquinaModel();
                    let peca = new PecaModel();
                    let implemento= new ImplementoModel();
    
                    for (const item of itensLocacao) {
                        if (item.iteLocTipo === 'Máquina') {
                            // Recupera as horas de uso do item da locação 
                            const horasUso = maqHorasUso[item.iteLocId];
        
                            if (horasUso !== undefined) { 
                                await maquina.atualizarHorasUso(item.iteLocId, horasUso); // Atualiza as horas de uso da máquina
                                await maquina.atualizarStatus(item.iteLocId, 1);
                            }
                            else{
                                res.status(400).json({ msg: "Preencha o campo Hora de Operação corretamente!" });
                            }
                        } 
                        else if (item.iteLocTipo === 'Peça') {
                            await peca.atualizarStatus(item.iteLocId, 1);
                        } 
                        else if (item.iteLocTipo === 'Implemento') {
                            await implemento.atualizarStatus(item.iteLocId, 1);
                        }
                    }
                    
                    // Retorna sucesso
                    res.status(201).json({ msg: "Locação finalizada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a finalização da Locação." });
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