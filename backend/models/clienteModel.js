import Database from "../utils/database.js";

const db = new Database();

export default class ClienteModel {
    #cliId;
    #cliNome;
    #cliCPF_CNPJ;
    #cliTelefone;
    #cliEmail;

    get cliId() { return this.#cliId; }
    set cliId(cliId) { this.#cliId = cliId; }

    get cliNome() { return this.#cliNome; }
    set cliNome(cliNome) { this.#cliNome = cliNome; }

    get cliCPF_CNPJ() { return this.#cliCPF_CNPJ; }
    set cliCPF_CNPJ(cliCPF_CNPJ) { this.#cliCPF_CNPJ = cliCPF_CNPJ; }

    get cliTelefone() { return this.#cliTelefone; }
    set cliTelefone(cliTelefone) { this.#cliTelefone = cliTelefone; }

    get cliEmail() { return this.#cliEmail; }
    set cliEmail(cliEmail) { this.#cliEmail = cliEmail; }

    constructor(cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail) {
        this.#cliId = cliId;
        this.#cliNome = cliNome;
        this.#cliCPF_CNPJ = cliCPF_CNPJ;
        this.#cliTelefone = cliTelefone;
        this.#cliEmail = cliEmail;
    }

    toJSON() {
        return {
            "cliId": this.#cliId,
            "cliNome": this.#cliNome,
            "cliCPF_CNPJ": this.#cliCPF_CNPJ,
            "cliTelefone": this.#cliTelefone,
            "cliEmail": this.#cliEmail
        };
    }

    toMAP(rows) {
        const listaClientes = [];

        rows.forEach(cliente => {
            listaClientes.push(new ClienteModel(
                cliente["cliId"], 
                cliente["cliNome"], 
                cliente["cliCPF_CNPJ"], 
                cliente["cliTelefone"], 
                cliente["cliEmail"]
            ));
        });

        return listaClientes;
    }

    async listarClientes() {
        const sql = `SELECT cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail FROM Cliente ORDER BY cliNome ASC;`;
        const rows = await db.ExecutaComando(sql);
        const listaClientes = this.toMAP(rows);
        return listaClientes;
    }

    async existeClientePorCPF_CNPJ(cliCPF_CNPJ) {
        const sql = `SELECT cliId FROM Cliente WHERE cliCPF_CNPJ = ?;`;
        const rows = await db.ExecutaComando(sql, [cliCPF_CNPJ]);
        return rows.length > 0; 
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#cliId == 0 || this.#cliId == null) {
            // Inserção
            sql = `INSERT INTO Cliente (cliNome, cliCPF_CNPJ, cliTelefone, cliEmail) VALUES (?, ?, ?, ?);`;
            valores = [this.#cliNome, this.#cliCPF_CNPJ, this.#cliTelefone, this.#cliEmail];
        } else {
            // Alteração
            sql = `UPDATE Cliente SET cliNome = ?, cliCPF_CNPJ = ?, cliTelefone = ?, cliEmail = ? WHERE cliId = ?;`;
            valores = [this.#cliNome, this.#cliCPF_CNPJ, this.#cliTelefone, this.#cliEmail, this.#cliId];
            console.log(valores);
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        const sql = `SELECT cliId, cliNome, cliCPF_CNPJ, cliTelefone, cliEmail FROM Cliente WHERE cliId = ?;`;
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