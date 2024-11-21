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
            let { impId, impNome, impDataAquisicao, impDescricao, impExibirCatalogo, impPrecoHora, impPrecoVenda, nomeImagemPrincipal, imagensBancoExcluir, imagensBanco} = req.body;
            
            if (impId && impNome && impDataAquisicao && impDescricao && impExibirCatalogo != null && impPrecoHora && impPrecoVenda) {
                let implemento = new ImplementoModel(impId, impNome, impDescricao, impDataAquisicao, 1, impExibirCatalogo, impPrecoVenda, impPrecoHora);

                let result = await implemento.gravar();

                if (result) {
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

            if (await implemento.isLocado(id) == false) {

                const imagensEquipamento = new ImagensEquipamentoModel();
                await imagensEquipamento.excluirImgImplemento(id);

                let result = await implemento.excluir(id);

                if (result) {
                    res.status(200).json({ msg: `Implemento excluído com sucesso!` });
                } 
                else {
                    res.status(500).json({ msg: "Erro durante a exclusão do implemento" });
                }
            } else {
                res.status(400).json({ msg: "Esse implemento está alugado!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
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
}