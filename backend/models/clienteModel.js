import Database from "../utils/database.js";

const db = new Database();

export default class ClienteModel {
    #cliId;
    #cliNome;
    #cliCPF_CNPJ;
    #usuTelefone;
    #usuEmail;

    get cliId() { return this.#cliId; }
    set cliId(cliId) { this.#cliId = cliId; }

    get cliNome() { return this.#cliNome; }
    set cliNome(cliNome) { this.#cliNome = cliNome; }

    get cliCPF_CNPJ() { return this.#cliCPF_CNPJ; }
    set cliCPF_CNPJ(cliCPF_CNPJ) { this.#cliCPF_CNPJ = cliCPF_CNPJ; }

    get usuTelefone() { return this.#usuTelefone; }
    set usuTelefone(usuTelefone) { this.#usuTelefone = usuTelefone; }

    get usuEmail() { return this.#usuEmail; }
    set usuEmail(usuEmail) { this.#usuEmail = usuEmail; }

    constructor(cliId, cliNome, cliCPF_CNPJ, usuTelefone, usuEmail) {
        this.#cliId = cliId;
        this.#cliNome = cliNome;
        this.#cliCPF_CNPJ = cliCPF_CNPJ;
        this.#usuTelefone = usuTelefone;
        this.#usuEmail = usuEmail;
    }

    toJSON() {
        return {
            "cliId": this.#cliId,
            "cliNome": this.#cliNome,
            "cliCPF_CNPJ": this.#cliCPF_CNPJ,
            "usuTelefone": this.#usuTelefone,
            "usuEmail": this.#usuEmail
        };
    }

    toMAP(rows) {
        const listaClientes = [];

        rows.forEach(cliente => {
            listaClientes.push(new ClienteModel(
                cliente["cliId"], 
                cliente["cliNome"], 
                cliente["cliCPF_CNPJ"], 
                cliente["usuTelefone"], 
                cliente["usuEmail"]
            ));
        });

        return listaClientes;
    }

    async listarClientes() {
        const sql = `SELECT cliId, cliNome, cliCPF_CNPJ, usuTelefone, usuEmail FROM Cliente;`;
        const rows = await db.ExecutaComando(sql);
        const listaClientes = this.toMAP(rows);
        return listaClientes;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#cliId == 0 || this.#cliId == null) {
            // Inserção
            sql = `INSERT INTO Cliente (cliNome, cliCPF_CNPJ, usuTelefone, usuEmail) VALUES (?, ?, ?, ?);`;
            valores = [this.#cliNome, this.#cliCPF_CNPJ, this.#usuTelefone, this.#usuEmail];
        } else {
            // Alteração
            sql = `UPDATE Cliente SET cliNome = ?, cliCPF_CNPJ = ?, usuTelefone = ?, usuEmail = ? WHERE cliId = ?;`;
            valores = [this.#cliNome, this.#cliCPF_CNPJ, this.#usuTelefone, this.#usuEmail, this.#cliId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        const sql = `SELECT cliId, cliNome, cliCPF_CNPJ, usuTelefone, usuEmail FROM Cliente WHERE cliId = ?;`;
        const valores = [id];
        const rows = await db.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            return rows;
        }
        return null;
    }

    async excluir(id) {
        const sql = `DELETE FROM Cliente WHERE cliId = ?;`;
        const valores = [id];
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}