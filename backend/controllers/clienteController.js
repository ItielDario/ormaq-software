import MaquinaModel from "../models/maquinaModel.js";

export default class MaquinaController {
    async listarMaquinas(req, res) {
        try {
            let maquina = new MaquinaModel();
            const maquinas = await maquina.listarMaquinas();
            res.status(200).json(maquinas);
        } catch (error) {
            res.status(500).json({ msg: "Erro ao listar máquinas!", error });
        }
    }

    async obterMaquina(req, res) {
        try {
            const { id } = req.params;
            let maquina = new MaquinaModel();
            const maquinaObtida = await maquina.obter(id);

            if (!maquinaObtida) {
                res.status(404).json({ msg: `Máquina com o id ${id} não encontrada!` });
            } else {
                res.status(200).json(maquinaObtida[0]);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarMaquina(req, res) {
        try {
            const {
                maqNome, 
                maqDataAquisicao, 
                maqTipo, 
                maqDescricao, 
                maqInativo, 
                maqHorasUso, 
                maqStatus,
                maqPrecoVenda,
                maqPrecoHora
            } = req.body;

            if (maqNome && maqDataAquisicao && maqTipo && maqStatus) {
                const maquina = new MaquinaModel(
                    0, 
                    maqNome, 
                    maqDataAquisicao, 
                    maqTipo, 
                    maqDescricao, 
                    maqInativo, 
                    maqHorasUso, 
                    maqStatus,
                    maqPrecoVenda,
                    maqPrecoHora
                );

                const result = await maquina.gravar();

                if (result) {
                    res.status(201).json({ msg: "Máquina cadastrada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro da máquina" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async alterarMaquina(req, res) {
        try {
            const {
                maqId,
                maqNome, 
                maqDataAquisicao, 
                maqTipo, 
                maqDescricao, 
                maqInativo, 
                maqHorasUso, 
                maqStatus,
                maqPrecoVenda,
                maqPrecoHora
            } = req.body;

            if (maqId && maqNome && maqDataAquisicao && maqTipo && maqStatus) {
                const maquina = new MaquinaModel(
                    maqId, 
                    maqNome, 
                    maqDataAquisicao, 
                    maqTipo, 
                    maqDescricao, 
                    maqInativo, 
                    maqHorasUso, 
                    maqStatus,
                    maqPrecoVenda,
                    maqPrecoHora
                );

                const result = await maquina.gravar();

                if (result) {
                    res.status(201).json({ msg: "Máquina alterada com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração da máquina" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirMaquina(req, res) {
        try {
            const { id } = req.params;
            let maquina = new MaquinaModel();

            const result = await maquina.excluir(id);

            if (result) {
                res.status(200).json({ msg: "Máquina excluída com sucesso!" });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão da máquina" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}