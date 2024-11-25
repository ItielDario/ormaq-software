import ClienteModel from "../models/clienteModel.js";
export default class clienteController {
    async listarClientes(req, res) {
        try {
            let cliente = new ClienteModel();
            cliente = await cliente.listarClientes();
            res.status(200).json(cliente);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async obterCliente(req, res) {
        try {
            let { id } = req.params;
            let cliente = new ClienteModel();
            cliente = await cliente.obter(id);
            if (cliente == null) {
                res.status(404).json({ msg: `Cliente com o id ${id} não encontrado!` });
            } else {
                res.status(200).json(cliente[0]);
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async cadastrarCliente(req, res) {
        try {
            let { cliNome, cliCPF_CNPJ, cliTelefone, cliEmail } = req.body;
    
            if (cliNome && cliCPF_CNPJ && cliEmail) {

                const cliente = new ClienteModel(0, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail);
                const clienteExistente = await cliente.existeClientePorCPF_CNPJ(cliCPF_CNPJ);
    
                if (clienteExistente) {// Verifica se o cliente já existe pelo CPF/CNPJ
                    return res.status(400).json({ msg: "Já existe um cliente cadastrado com este CPF/CNPJ." });
                }
    
                const result = await cliente.gravar();
                if (result) {
                    res.status(201).json({ msg: "Cliente cadastrado com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante o cadastro do Cliente" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }    

    async alterarCliente(req, res) {
        try {
            let { cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail } = req.body;
            if (cliId && cliNome && cliCPF_CNPJ && cliEmail) {

                let cliente = new ClienteModel(cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail);
                let result = await cliente.gravar();

                if (result) {
                    res.status(201).json({ msg: "Cliente alterado com sucesso!" });
                } else {
                    res.status(500).json({ msg: "Erro durante a alteração do Cliente" });
                }
            } else {
                res.status(400).json({ msg: "Por favor, preencha os campos obrigatórios corretamente!" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }

    async excluirCliente(req, res) {
        try {
            let { id } = req.params;
            let cliente = new ClienteModel();
            let result = await cliente.excluir(id);
            if (result) {
                res.status(200).json({ msg: "Cliente excluído com sucesso!" });
            } else {
                res.status(500).json({ msg: "Erro durante a exclusão do cliente" });
            }
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ msg: "Erro interno de servidor!" });
        }
    }
}