import MaquinaModel from "../models/maquinaModel.js"
import MaquinaAluguelModel from "../models/maquinaAluguelModel.js"
import ImagensEquipamentoModel from "../models/imagensEquipamentoModel.js"
import enviarObjeto from '../utils/oracleBucket.js'; 

export default class maquinaController {
    
    async listarMaquinas(req, res){ 
        try{
            let maquinas = new MaquinaModel()
            maquinas = await maquinas.listarMaquinas();
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

            let imagensMaquina = new ImagensEquipamentoModel();
            imagensMaquina = await imagensMaquina.obterImgMaquina(id);

            if(maquina == null && maquinaAluguel == null) {
                res.status(404).json({msg: `Maquina com o id ${id} não encontrada!`})
            }
            else{
                res.status(200).json({maquina, maquinaAluguel, imagensMaquina});
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
                maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal, maqExibirCatalogo, maqDescricao, nomeImagemPrincipal
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

                let encontrouMaquina = await maquina.varificarSerieChassi(maqSerie)

                if(encontrouMaquina[0].Total == 0){
                    let maquinaId = await maquina.gravar();
    
                    if (maquinaId) {
                        let maquinaAluguel = new MaquinaAluguelModel(0, maquinaId, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal);
                        let maquinaAluguelResult = await maquinaAluguel.gravar();
    
                        if(maquinaAluguelResult){
                            const imagens = req.files;  
                            let achouImagemPrincipal = true
        
                            if (imagens) {
                                for (let i = 0; i < imagens.length; i++) { // Loop para enviar todas as imagens para o Oracle Cloud Storage
                                    const imagem = imagens[i];
                                    let imagensEquipamento = null
        
                                    const nomeImagem = new Date().getTime() + '-' + imagem.originalname;  // Gerar um nome único
                                    await enviarObjeto(nomeImagem, imagem.buffer); // Envia a imagem para o Oracle Cloud Storage
                                    const urlImagem = `https://objectstorage.us-phoenix-1.oraclecloud.com/n/axfyzw7gyrvi/b/bucket-ormaq/o/${nomeImagem}`; // Cria a URL pública da imagem
    
                                    if(nomeImagemPrincipal == imagem.originalname && achouImagemPrincipal){
                                        imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  null, maquinaId, null);
                                        achouImagemPrincipal = false;
                                    }
                                    else{
                                        imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  null, maquinaId, null);
                                    }
        
                                    await imagensEquipamento.gravar();
                                }
                            }
                        
                            return res.status(201).json({ msg: "Máquina cadastrada com sucesso!" });
                        }
    
                        return res.status(500).json({ msg: "Erro durante o cadastro dos valores da máquina!" });
                    } 
                    else {
                        return res.status(500).json({ msg: "Erro durante o cadastro da Máquina!" });
                    }
                }
                else {
                    return res.status(500).json({ msg: "Já exite uma máquina cadastrada com a série/chassi: " + maqSerie});
                }
            } 
            else {
                return res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } 
        catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }    

    async alterarMaquina(req, res) {
        try {
            let { 
                maqId, maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, 
                maqHorasUso, maqPrecoVenda, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, 
                maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal, maqExibirCatalogo, maqDescricao, maqStatus, nomeImagemPrincipal, 
                imagensBancoExcluir, imagensBanco 
            } = req.body;
    
            if (
                maqId && maqNome && maqDataAquisicao && maqTipo && maqModelo && maqSerie && 
                maqAnoFabricacao && maqHorasUso !== undefined && maqPrecoVenda && 
                maqPrecoAluguelDiario && maqPrecoAluguelSemanal && maqPrecoAluguelQuinzenal && 
                maqPrecoAluguelMensal && maqExibirCatalogo !== undefined && maqDescricao && maqStatus
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
                    maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, maqStatus, maqPrecoVenda);
                let result = await maquina.gravar(); 
    
                if (result) {

                    // Altera o exibe nos classificados se a máquina estiver vendida/disponível
                    if(maqStatus == 4){ await maquina.alterarExibicao(maqId, 0) }
                    if(maqStatus == 1){ await maquina.alterarExibicao(maqId, maqExibirCatalogo) }

                    // Atualizando os valores de aluguel da máquina
                    let maquinaAluguel = new MaquinaAluguelModel(0, maqId, maqPrecoAluguelDiario, maqPrecoAluguelSemanal, maqPrecoAluguelQuinzenal, maqPrecoAluguelMensal);

                    // Exclui os alugueis da máquina
                    await maquinaAluguel.excluir(maqId); 

                    // Cadastra novamente os alugueis da máquina
                    let maquinaAluguelResult = await maquinaAluguel.gravar(); 

                    if(maquinaAluguelResult){
                        const imagens = req.files;  
                        let achouImagemPrincipal = true;

                        let imagensEquipamento = new ImagensEquipamentoModel();

                        if (typeof imagensBanco === 'string') {imagensBanco = JSON.parse(imagensBanco)}
                        if (typeof imagensBancoExcluir === 'string') {imagensBancoExcluir = JSON.parse(imagensBancoExcluir)}

                        for (let i = 0; i < imagensBancoExcluir.length; i++){
                            await imagensEquipamento.excluir(imagensBancoExcluir[i].id);
                        }

                        // Verifica se a imagem principal é alguma imagem que ja estava cadastada antes da alteração
                        for (let i = 0; i < imagensBanco.length; i++){
                            if(nomeImagemPrincipal == imagensBanco[i].file.name && achouImagemPrincipal){
                                await imagensEquipamento.atualizarImgPrincipal(1, imagensBanco[i].id);
                                achouImagemPrincipal = false;
                            }
                            else{
                                await imagensEquipamento.atualizarImgPrincipal(0, imagensBanco[i].id);
                            }  
                        }

                        // Envia todas as imagens novas para o Oracle Cloud Storage e salva no banco
                        if (imagens) {
                            for (let i = 0; i < imagens.length; i++) { 
                                const imagem = imagens[i];
                                
                                const nomeImagem = new Date().getTime() + '-' + imagem.originalname;  // Gerar um nome único
                                await enviarObjeto(nomeImagem, imagem.buffer); // Envia a imagem para o Oracle Cloud Storage
                                const urlImagem = `https://objectstorage.us-phoenix-1.oraclecloud.com/n/axfyzw7gyrvi/b/bucket-ormaq/o/${nomeImagem}`; // Cria a URL pública da imagem

                                if(nomeImagemPrincipal == imagem.originalname && achouImagemPrincipal){
                                    imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  null, maqId, null);
                                    achouImagemPrincipal = false;
                                }
                                else{
                                    imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  null, maqId, null);
                                }
    
                                await imagensEquipamento.gravar();
                            }
                        }
                    
                        return res.status(201).json({ msg: "Máquina alterada com sucesso!" });
                    }
    
                    return res.status(500).json({ msg: "Erro durante a alteração dos valores de aluguel da máquina!" });
                } 
                else {
                    return res.status(500).json({ msg: "Erro durante a alteração da máquina!" });
                }
            } 
            else {
                return res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } 
        catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }    
    
    async excluirMaquina(req, res) {
        try {
            let { id } = req.params;
            let maquina = new MaquinaModel();
    
            // Verifica se a máquina está locada ou em manutenção
            if (await maquina.isLocado(id) == false && await maquina.isManutancao(id) == false) {
    
                // Exclui as imagens associadas à máquina
                const imagensEquipamento = new ImagensEquipamentoModel();
                await imagensEquipamento.excluirImgMaquina(id);
    
                // Tenta excluir a máquina
                let result = await maquina.excluir(id);
    
                if (result) {
                    res.status(200).json({ msg: `Máquina excluída com sucesso!` });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante a exclusão da máquina" });
                }
            } 
            else {
                res.status(400).json({ msg: "Essa máquina está alugada ou em manutenção!" });
            }
        } 
        catch (ex) {
            console.log(ex);
    
            // Trata o erro específico de integridade referencial (chave estrangeira)
            if (ex.code === 'ER_ROW_IS_REFERENCED_2') {
                res.status(400).json({ msg: "Exclua as manutenções e as locações feitas nessa máquina antes de excluí-la." });
            } 
            else {
                // Resposta genérica para outros erros
                res.status(500).json({ msg: "Erro interno de servidor!" });
            }
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

    async listarMaquinasDaLocacao(req, res) {
        try{
            let { id } = req.params;

            let maquina = new MaquinaModel();
            maquina = await maquina.listarMaquinasDaLocacao(id);

            if(maquina == null && maquinaAluguel == null) {
                res.status(404).json({msg: `Maquina com o id ${id} não encontrada!`})
            }
            else{
                res.status(200).json({maquina});
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async exibicaoClassificados(req, res){ 
        try{
            const { id } = req.params;
            const { maqExibirCatalogo } = req.body;

            let maquinaModel = new MaquinaModel()
            let maquina = await maquinaModel.obter(id)
            
            if(maquina.eqpStaId == 4){
                res.status(404).json({ msg: `Não é possivel exibir nos classificados, pois a maquina com a série/chassi ${maquina.maqSerie} está vendida!` }) 
            }
            else{
                if(await maquinaModel.alterarExibicao(id, maqExibirCatalogo)){
                    res.status(200).json({ msg:`Exibição da maquina com a série/chassi ${maquina.maqSerie} alterada!` });
                }
                else{
                    res.status(404).json({ msg:`Erro ao alterar a exibição da maquina com a série/chassi ${maquina.maqSerie}!` });
                }
            }
        }
        catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    async listarMaquinasParaExibicao(req, res){ 
        try{
            let maquinas = new MaquinaModel()
            maquinas = await maquinas.listarMaquinasParaExibicao()
            res.status(200).json(maquinas);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async buscaMaquinaExibir(req, res) {
        try{
            let { id } = req.params;

            let maquina = new MaquinaModel();
            maquina = await maquina.buscaMaquinaExibir(id);

            if(maquina != null){
                let maquinaAluguel = new MaquinaAluguelModel();
                maquinaAluguel = await maquinaAluguel.obter(id);
    
                let imagensMaquina = new ImagensEquipamentoModel();
                imagensMaquina = await imagensMaquina.obterImgMaquina(id);

                if(maquinaAluguel != null) {
                    res.status(200).json({maquina, maquinaAluguel, imagensMaquina});
                }
                else{
                    res.status(404).json({msg: `Maquina com o id ${id} não encontrada!`})
                }
            }
            else{
                res.status(404).json({msg: `Maquina não disponível para exibição!`})
            } 
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }
}