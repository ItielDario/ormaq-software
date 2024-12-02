import ImplementoModel from "../models/implementoModel.js";
import ImagensEquipamentoModel from "../models/imagensEquipamentoModel.js"
import enviarObjeto from '../utils/oracleBucket.js'; 

export default class ImplementoController {
    async listarImplementos(req, res) {
        try {
            let implemento = new ImplementoModel();
            implemento = await implemento.listarImplementos();
            res.status(200).json(implemento);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async obterImplemento(req, res) {
        try {
            let { id } = req.params;
            let implemento = new ImplementoModel();
            implemento = await implemento.obter(id);

            let imagensImplemento = new ImagensEquipamentoModel();
            imagensImplemento = await imagensImplemento.obterImgImplemento(id);

            if (implemento == null) {
                res.status(404).json({ msg: `Implemento com o id ${id} não encontrado!` });
            } 
            else {
                implemento = implemento[0]
                res.status(200).json({implemento, imagensImplemento});
            }
        } 
        catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarImplemento(req, res) {
        try {
            let { impNome, impDataAquisicao, impDescricao, impExibirCatalogo, impPrecoHora, impPrecoVenda, nomeImagemPrincipal} = req.body;

            if (impNome && impDataAquisicao && impDescricao && impExibirCatalogo != null && impPrecoHora && impPrecoVenda) {
                let implemento = new ImplementoModel(0, impNome, impDescricao, impDataAquisicao, 1, impExibirCatalogo, impPrecoVenda, impPrecoHora);

                let implementoId = await implemento.gravar();

                if (implementoId) {
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
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  null, null, implementoId);
                                achouImagemPrincipal = false;
                            }
                            else{
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  null, null, implementoId);
                            }

                            await imagensEquipamento.gravar();
                        }
                    }

                    res.status(201).json({ msg: "Implemento cadastrado com sucesso!" });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante o cadastro do implemento" });
                }
            } 
            else {
                res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } 
        catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarImplemento(req, res) {
        try {
            let { impId, impNome, impDataAquisicao, impDescricao, impExibirCatalogo, impPrecoHora, impPrecoVenda, impStatus, nomeImagemPrincipal, imagensBancoExcluir, imagensBanco} = req.body;
             
            if (impId && impNome && impDataAquisicao && impDescricao && impExibirCatalogo != null && impPrecoHora && impPrecoVenda && impStatus) {
                let implemento = new ImplementoModel(impId, impNome, impDescricao, impDataAquisicao, impStatus, impExibirCatalogo, impPrecoVenda, impPrecoHora);

                let result = await implemento.gravar();

                if (result) {

                    // Altera o exibe nos classificados se a máquina estiver vendida/disponível
                    if(impStatus == 4){ await implemento.alterarExibicao(impId, 2) }
                    if(impStatus == 1){ await implemento.alterarExibicao(impId, 1) }

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
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 1,  null, null, impId);
                                achouImagemPrincipal = false;
                            }
                            else{
                                imagensEquipamento = new ImagensEquipamentoModel(0, urlImagem, imagem.originalname, 0,  null, null, impId);
                            }

                            await imagensEquipamento.gravar();
                        }
                    }

                    res.status(200).json({ msg: "Implemento alterado com sucesso!" });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante a alteração do implemento" });
                }
            } 
            else {
                res.status(400).json({ msg: "Por favor, preencha os campos abaixo corretamente!" });
            }
        } 
        catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirImplemento(req, res) {
        try {
            let { id } = req.params;
            let implemento = new ImplementoModel();
    
            // Verifica se o implemento está locado ou em manutenção
            if (await implemento.isLocado(id) == false && await implemento.isManutencao(id) == false) {
    
                // Exclui as imagens associadas ao implemento
                const imagensEquipamento = new ImagensEquipamentoModel();
                await imagensEquipamento.excluirImgImplemento(id);
    
                // Tenta excluir o implemento
                let result = await implemento.excluir(id);
    
                if (result) {
                    res.status(200).json({ msg: `Implemento excluído com sucesso!` });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante a exclusão do implemento" });
                }
            } 
            else {
                res.status(400).json({ msg: "Esse implemento está alugado ou em manutenção!" });
            }
        } 
        catch (ex) {
            console.log(ex);
    
            // Trata o erro específico de integridade referencial (chave estrangeira)
            if (ex.code === 'ER_ROW_IS_REFERENCED_2') {
                res.status(400).json({ msg: "Exclua as manutenções feitas nesse implemento antes de excluí-lo." });
            } 
            else {
                // Resposta genérica para outros erros
                res.status(500).json({ msg: "Erro interno de servidor!" });
            }
        }
    }    

    async listarImplementosDisponiveis(req, res){ 
        try{
            let implemento = new ImplementoModel()
            implemento = await implemento.listarImplementosDisponiveis()
            res.status(200).json(implemento);
        }
        catch(error){
            res.status(500).json(error)
        }
    }

    async exibicaoClassificados(req, res){ 
        try{
            const { id } = req.params;
            const { impExibirCatalogo } = req.body;
            
            let implementoModel = new ImplementoModel()
            let implemento = await implementoModel.obter(id)
            
            if(implemento[0].impStatus == 4){
                res.status(404).json({ msg: `Não é possivel exibir nos classificados, pois o implemento ${implemento[0].impNome} está vendido!` })
            }
            else{
                if(await implementoModel.alterarExibicao(id, impExibirCatalogo)){
                    res.status(200).json({ msg:`Exibição do implemento ${implemento[0].impNome} alterada!` });
                }
                else{
                    res.status(404).json({ msg:`Erro ao alterar a exibição da implemento ${implemento[0].impNome}!` });
                }
            }
        }
        catch(error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    async listarImplementosParaExibicao(req, res){ 
        try{
            let implemento = new ImplementoModel()
            implemento = await implemento.listarImplementosParaExibicao()
            res.status(200).json(implemento);
        }
        catch(error){
            res.status(500).json(error)
        }
    }
}