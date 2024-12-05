import PecaModel from "../models/pecaModel.js" 
import ImagensEquipamentoModel from "../models/imagensEquipamentoModel.js"
import enviarObjeto from '../utils/oracleBucket.js'; 

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

            let imagensPeca = new ImagensEquipamentoModel();
            imagensPeca = await imagensPeca.obterImgPeca(id);

            if(peca == null) {
                res.status(404).json({msg: `Peça com o id ${id} não encontrada!`})
            }
            else{
                peca = peca[0];
                res.status(200).json({peca, imagensPeca});
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }

    async cadastrarPeca(req, res) {
        try {
            let { pecaNome, pecaDataAquisicao, pecaDescricao, pecaExibirCatalogo, pecaPrecoHora, pecaPrecoVenda, nomeImagemPrincipal} = req.body;

            if(pecaNome != "" && pecaDataAquisicao != "" && pecaDescricao != "" && pecaExibirCatalogo != "" && pecaPrecoHora != "" && pecaPrecoVenda != "") {

                let peca = new PecaModel(0, pecaNome, pecaDescricao, pecaDataAquisicao, 1, pecaExibirCatalogo, pecaPrecoVenda, pecaPrecoHora);
                let pecaId  = await peca.gravar();

                if(pecaId) {
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
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  pecaId, null, null);
                                achouImagemPrincipal = false;
                            }
                            else{
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  pecaId, null, null);
                            }

                            await imagensEquipamento.gravar();
                        }
                    }

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

    async alterarPeca(req, res) {
        try {
            let { pecaId, pecaNome, pecaDataAquisicao, pecaDescricao, pecaExibirCatalogo, pecaPrecoHora, pecaPrecoVenda, pecaStatus, nomeImagemPrincipal, imagensBancoExcluir, imagensBanco } = req.body;

            if(pecaId != "" && pecaNome != "" && pecaDataAquisicao != "" && pecaDescricao != "" && pecaExibirCatalogo != "" && pecaPrecoHora != "" && pecaPrecoVenda != "" && pecaStatus != "") {
                let peca = new PecaModel(pecaId, pecaNome, pecaDescricao, pecaDataAquisicao, pecaStatus, pecaExibirCatalogo, pecaPrecoVenda, pecaPrecoHora);

                let result  = await peca.gravar();

                if(result) {

                    // Altera o exibe nos classificados se a máquina estiver vendida/disponível
                    if(pecaStatus == 4){ await peca.alterarExibicao(pecaId, 0) }
                    if(pecaStatus == 1){ await peca.alterarExibicao(pecaId, pecaExibirCatalogo) }

                    const imagens = req.files;  
                    let achouImagemPrincipal = true
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

                    if (imagens) {
                        for (let i = 0; i < imagens.length; i++) { // Loop para enviar todas as imagens para o Oracle Cloud Storage
                            const imagem = imagens[i];
                            let imagensEquipamento = null

                            const nomeImagem = new Date().getTime() + '-' + imagem.originalname;  // Gerar um nome único
                            await enviarObjeto(nomeImagem, imagem.buffer); // Envia a imagem para o Oracle Cloud Storage
                            const urlImagem = `https://objectstorage.us-phoenix-1.oraclecloud.com/n/axfyzw7gyrvi/b/bucket-ormaq/o/${nomeImagem}`; // Cria a URL pública da imagem

                            if(nomeImagemPrincipal == imagem.originalname && achouImagemPrincipal){
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  pecaId, null, null);
                                achouImagemPrincipal = false;
                            }
                            else{
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  pecaId, null, null);
                            }

                            await imagensEquipamento.gravar();
                        }
                    }

                    res.status(201).json({msg: "Peça alterada com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro durante a alteração da Peça"});
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

    async excluirPeca(req, res) {
        try {
            let { id } = req.params;
            let peca = new PecaModel();
    
            // Verifica se a peça está locada ou em manutenção
            if (await peca.isLocado(id) == false && await peca.isManutencao(id) == false) {
    
                // Exclui as imagens associadas à peça
                const imagensEquipamento = new ImagensEquipamentoModel();
                await imagensEquipamento.excluirImgPeca(id);
    
                // Tenta excluir a peça
                let result = await peca.excluir(id);
    
                if (result) {
                    res.status(200).json({ msg: `Peça excluída com sucesso!` });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante a exclusão da peça" });
                }
            } 
            else {
                res.status(400).json({ msg: "Essa peça está alugada ou em manutenção!" });
            }
        } 
        catch (ex) {
            console.log(ex);
    
            // Trata o erro específico de integridade referencial (chave estrangeira)
            if (ex.code === 'ER_ROW_IS_REFERENCED_2') {
                res.status(400).json({ msg: "Exclua as manutenções feitas nessa peça antes de excluí-la." });
            } else {
                // Resposta genérica para outros erros
                res.status(500).json({ msg: "Erro interno de servidor!" });
            }
        }
    }    

    async listarPecasDisponiveis(req, res){ 
        try{
            let pecas = new PecaModel()
            pecas = await pecas.listarPecasDisponiveis()
            res.status(200).json(pecas);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async exibicaoClassificados(req, res){ 
        try{
            const { id } = req.params;
            const { pecExibirCatalogo } = req.body;

            let pecaModel = new PecaModel()
            let peca = await pecaModel.obter(id)

            if(peca[0].pecStatus == 4){
                res.status(404).json({ msg: `Não é possivel exibir nos classificados, pois a peça ${peca[0].pecNome} está vendida!` })   
            }
            else{
                if(await pecaModel.alterarExibicao(id, pecExibirCatalogo)){
                    res.status(200).json({ msg:`Exibição da peça ${peca[0].pecNome} alterada!` });
                }
                else{
                    res.status(404).json({ msg:`Erro ao alterar a exibição da peca ${peca[0].pecNome}!` });
                }
            }
        }
        catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    async listarPecasParaExibicao(req, res){ 
        try{
            let peca = new PecaModel()
            peca = await peca.listarPecasParaExibicao()
            res.status(200).json(peca);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async buscaPecaExibir(req, res) {
        try{
            let { id } = req.params;

            let peca = new PecaModel();
            peca = await peca.buscaPecaExibir(id);

            if(peca != null){
                let imagensPeca = new ImagensEquipamentoModel();
                imagensPeca = await imagensPeca.obterImgPeca(id);

                res.status(200).json({peca, imagensPeca});
            }
            else{
                res.status(404).json({msg: `Peça não disponível para exibição!`})
            }
        }
        catch(ex) {
            console.log(ex)
            res.status(500).json({msg: "Erro interno de servidor!"});
        }
    }
}