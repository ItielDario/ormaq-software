import MaquinaModel from "../models/maquinaModel.js"
import MaquinaAluguelModel from "../models/maquinaAluguelModel.js"

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

            let maquinaAluguel = new MaquinaAluguelModel();
            maquinaAluguel = await maquinaAluguel.obter(id);

            if(maquina == null && maquinaAluguel == null) {
                res.staus(404).json({msg: `Maquina com o id ${id} não encontrada!`})
            }
            else{
                res.status(200).json({maquina, maquinaAluguel});
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async cadastrarMaquina(req, res) {
        try {
            let { 
                maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, 
                maqHorasUso, maqPrecoVenda, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, 
                maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal, maqExibirCatalogo, maqDescricao 
            } = req.body;
    
            if (
                maqNome && maqDataAquisicao && maqTipo && maqModelo && maqSerie && 
                maqAnoFabricacao && maqHorasUso !== undefined && maqPrecoVenda && 
                maqPrecoAluguelDiario && maqPrecoAluguelSemanal && maqPrecoAluguelQuinzenal && 
                maqPrecoAluguelMensal && maqExibirCatalogo !== undefined && maqDescricao
            ) {
                // Validação da hora de uso
                if (parseFloat(maqHorasUso) < 0) {
                    return res.status(400).json({ msg: "A hora de uso não pode ser negativa!" });
                }
    
                // Validação dos valores
                if (parseFloat(maqPrecoVenda) < 0 || parseFloat(maqPrecoAluguelDiario) < 0 || parseFloat(maqPrecoAluguelSemanal) < 0 || parseFloat(maqPrecoAluguelQuinzenal) < 0 || parseFloat(maqPrecoAluguelMensal) < 0) {
                    return res.status(400).json({ msg: "Os preços não podem ser negativos!" });
                }
    
                let maquina = new MaquinaModel(0, maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, 
                    maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, 1, maqPrecoVenda);
                let maquinaId = await maquina.gravar();
    
                if (maquinaId) {
                    let maquinaAluguel = new MaquinaAluguelModel(0, maquinaId, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal);
                    let maquinaAluguelResult = await maquinaAluguel.gravar();

                    if(maquinaAluguelResult){
                        return res.status(201).json({ msg: "Máquina cadastrada com sucesso!" });
                    }
    
                    return res.status(500).json({ msg: "Erro durante o cadastro dos valores da máquina!" });
                } else {
                    return res.status(500).json({ msg: "Erro durante o cadastro da Máquina!" });
                }
            } else {
                return res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }    

    async alterarMaquina(req, res) {
        try {
            let { 
                maqId, maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, 
                maqHorasUso, maqPrecoVenda, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, 
                maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal, maqExibirCatalogo, maqDescricao 
            } = req.body;
    
            if (
                maqId && maqNome && maqDataAquisicao && maqTipo && maqModelo && maqSerie && 
                maqAnoFabricacao && maqHorasUso !== undefined && maqPrecoVenda && 
                maqPrecoAluguelDiario && maqPrecoAluguelSemanal && maqPrecoAluguelQuinzenal && 
                maqPrecoAluguelMensal && maqExibirCatalogo !== undefined && maqDescricao
            ) {
                // Validação da hora de uso
                if (parseFloat(maqHorasUso) < 0) {
                    return res.status(400).json({ msg: "A hora de uso não pode ser negativa!" });
                }
    
                // Validação dos preços
                if (parseFloat(maqPrecoVenda) < 0 || parseFloat(maqPrecoAluguelDiario) < 0 || parseFloat(maqPrecoAluguelSemanal) < 0 || parseFloat(maqPrecoAluguelQuinzenal) < 0 || parseFloat(maqPrecoAluguelMensal) < 0) {
                    return res.status(400).json({ msg: "Os preços não podem ser negativos!" });
                }
    
                let maquina = new MaquinaModel(maqId, maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, 
                    maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, 1, maqPrecoVenda);
                let result = await maquina.gravar(); 
    
                if (result) {
                    // Atualizando os valores de aluguel da máquina
                    let maquinaAluguel = new MaquinaAluguelModel(0, maqId, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal);

                    // Exclui os alugueis da máquina
                    await maquinaAluguel.excluir(maqId); 

                    // Cadastra novamente os alugueis da máquina
                    let maquinaAluguelResult = await maquinaAluguel.gravar(); 
    
                    if (maquinaAluguelResult) {
                        return res.status(200).json({ msg: "Máquina alterada com sucesso!" });
                    }
    
                    return res.status(500).json({ msg: "Erro durante a alteração dos valores de aluguel da máquina!" });
                } else {
                    return res.status(500).json({ msg: "Erro durante a alteração da máquina!" });
                }
            } else {
                return res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }    
    
    async excluirMaquina(req, res) {
        try{
            let {id} = req.params;
            let maquina = new MaquinaModel();
            if(await maquina.isLocado(id) == false){

                let result = await maquina.excluir(id);
                if(result) {
                    res.status(200).json({msg: `Máquina excluída com sucesso!`});
                }
                else{
                    res.status(500).json({msg: "Erro durante a exclusão da máquina"});
                }
            }
            else{
                res.status(400).json({msg: "Essa máquina está alugada!"})
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async listarMaquinasDisponiveis(req, res){ 
        try{
            let maquinas = new MaquinaModel()
            maquinas = await maquinas.listarMaquinasDisponiveis()
            res.status(200).json(maquinas);
        }
        catch(error){
            res.status(500).json(error)
        }
    }
}