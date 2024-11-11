import UsuarioModel from "../models/usuarioModel.js";

export default class UsuarioController {
    async listarUsuarios(req, res) {
        try {
            let usuario = new UsuarioModel();
            usuario = await usuario.listarUsuarios();
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async obterUsuario(req, res) {
        try {
            let { id } = req.params;
            let usuario = new UsuarioModel();
            usuario = await usuario.obter(id);
            if (usuario == null) {
                res.status(404).json({ msg: `Usuário com o id ${id} não encontrado!` });
            } else {
                res.status(200).json(usuario[0]);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarUsuario(req, res) {
        try {
            let { usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil } = req.body;

            if (usuNome && usuSenha && usuPerfil) {
                const usuario = new UsuarioModel(0, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil);
                const usuarioExistente = await usuario.existeUsuarioPorNome(usuNome);

                if (usuarioExistente) { // Verifica se o usuário já existe pelo nome
                    return res.status(400).json({ msg: "Já existe um usuário cadastrado com este nome." });
                }

                const result = await usuario.gravar();
                if (result) {
                    res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro do Usuário" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarUsuario(req, res) {
        try {
            let { usuId, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil } = req.body;
            if (usuId && usuNome && usuSenha && usuPerfil) {
                let usuario = new UsuarioModel(usuId, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil);
                let result = await usuario.gravar();

                if (result) {
                    res.status(201).json({ msg: "Usuário alterado com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração do Usuário" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirUsuario(req, res) {
        try {
            let { id } = req.params;
            let usuario = new UsuarioModel();
            let result = await usuario.excluir(id);
            if (result) {
                res.status(200).json({ msg: "Usuário excluído com sucesso!" });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão do usuário" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}
