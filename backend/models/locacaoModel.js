import Database from "../utils/database.js";
// import ClienteModel from "./clienteModel.js";
// import UsuarioModel from "./usuarioModel.js";
// import LocacaoStatusModel from "./locacaoStatusModel.js";

const db = new Database();

export default class LocacaoModel {
    #locId;
    #locDataInicio;
    #locDataFinalPrevista;
    #locDataFinalEntrega;
    #locValorTotal;
    #locDesconto;
    #locValorFinal;
    #cliente;
    #usuario;
    #locacaoStatus;

    get locId() { return this.#locId; }
    set locId(locId) { this.#locId = locId; }

    get locDataInicio() { return this.#locDataInicio; }
    set locDataInicio(locDataInicio) { this.#locDataInicio = locDataInicio; }

    get locDataFinalPrevista() { return this.#locDataFinalPrevista; }
    set locDataFinalPrevista(locDataFinalPrevista) { this.#locDataFinalPrevista = locDataFinalPrevista; }

    get locDataFinalEntrega() { return this.#locDataFinalEntrega; }
    set locDataFinalEntrega(locDataFinalEntrega) { this.#locDataFinalEntrega = locDataFinalEntrega; }

    get locValorTotal() { return this.#locValorTotal; }
    set locValorTotal(locValorTotal) { this.#locValorTotal = locValorTotal; }

    get locDesconto() { return this.#locDesconto; }
    set locDesconto(locDesconto) { this.#locDesconto = locDesconto; }

    get locValorFinal() { return this.#locValorFinal; }
    set locValorFinal(locValorFinal) { this.#locValorFinal = locValorFinal; }

    get cliente() { return this.#cliente; }
    set cliente(cliente) { this.#cliente = cliente; }

    get usuario() { return this.#usuario; }
    set usuario(usuario) { this.#usuario = usuario; }

    get locacaoStatus() { return this.#locacaoStatus; }
    set locacaoStatus(locacaoStatus) { this.#locacaoStatus = locacaoStatus; }

    constructor(locId, locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, cliente, usuario, locacaoStatus) {
        this.#locId = locId;
        this.#locDataInicio = locDataInicio;
        this.#locDataFinalPrevista = locDataFinalPrevista;
        this.#locDataFinalEntrega = locDataFinalEntrega;
        this.#locValorTotal = locValorTotal;
        this.#locDesconto = locDesconto;
        this.#locValorFinal = locValorFinal;
        this.#cliente = cliente;
        this.#usuario = usuario;
        this.#locacaoStatus = locacaoStatus;
    }

    toJSON() {
        return {
            "locId": this.#locId,
            "locDataInicio": this.#locDataInicio,
            "locDataFinalPrevista": this.#locDataFinalPrevista,
            "locDataFinalEntrega": this.#locDataFinalEntrega,
            "locValorTotal": this.#locValorTotal,
            "locDesconto": this.#locDesconto,
            "locValorFinal": this.#locValorFinal,
            "cliente": this.#cliente,
            "usuario": this.#usuario,
            "locacaoStatus": this.#locacaoStatus
        };
    }

    toMAP(rows) {
        const listaLocacoes = [];

        rows.forEach(locacao => {
            // Criando os objetos Cliente, Usuario e LocacaoStatus
            const cliente = new ClienteModel(locacao["cliId"], locacao["cliNome"], locacao["cliCPF_CNPJ"], locacao["usuTelefone"], locacao["usuEmail"]);
            const usuario = new UsuarioModel(locacao["usuId"], locacao["usuNome"], locacao["usuTelefone"], locacao["usuEmail"], locacao["usuPerfil"]);
            const locacaoStatus = new LocacaoStatusModel(locacao["locStatusId"], locacao["locStaDescricao"]);

            listaLocacoes.push(new LocacaoModel(
                locacao["locId"],                   // ID da locação
                locacao["locDataInicio"],           // Data de início
                locacao["locDataFinalPrevista"],    // Data final prevista
                locacao["locDataFinalEntrega"],     // Data de entrega
                locacao["locValorTotal"],           // Valor total
                locacao["locDesconto"],             // Desconto
                locacao["locValorFinal"],           // Valor final
                cliente,                            // Cliente
                usuario,                            // Usuário
                locacaoStatus                       // Status da locação
            ));
        });
        return listaLocacoes;
    }

    async listarLocacoes() {
        const sql = `
            SELECT l.locId, l.locDataInicio, l.locDataFinalPrevista, l.locDataFinalEntrega, l.locValorTotal, l.locDesconto, l.locValorFinal, 
                   c.cliId, c.cliNome, c.cliCPF_CNPJ, c.usuTelefone, c.usuEmail, 
                   u.usuId, u.usuNome, u.usuTelefone, u.usuEmail, u.usuPerfil,
                   ls.locStaId AS locStatusId, ls.locStaDescricao
            FROM Locacao l
            JOIN Cliente c ON l.locCliId = c.cliId
            JOIN Usuario u ON l.locUsuId = u.usuId
            JOIN Locacao_Status ls ON l.locStatus = ls.locStaId;`;

        const rows = await db.ExecutaComando(sql);
        // const listaLocacoes = this.toMAP(rows);

        return rows;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#locId == 0 || this.#locId == null) {
            // Inserção
            sql = `INSERT INTO Locacao (locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locCliId, locUsuId, locStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#locDataInicio, this.#locDataFinalPrevista, this.#locDataFinalEntrega, this.#locValorTotal, this.#locDesconto, this.#locValorFinal, this.#cliente, this.#usuario, this.#locacaoStatus];
        } else {
            // Alteração
            sql = `UPDATE Locacao SET locDataInicio = ?, locDataFinalPrevista = ?, locDataFinalEntrega = ?, locValorTotal = ?, locDesconto = ?, locValorFinal = ?, locStatus = ? WHERE locId = ?`;
            valores = [this.#locDataInicio, this.#locDataFinalPrevista, this.#locDataFinalEntrega, this.#locValorTotal, this.#locDesconto, this.#locValorFinal, this.#locacaoStatus, this.#locId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = `
            SELECT l.locId, l.locDataInicio, l.locDataFinalPrevista, l.locDataFinalEntrega, l.locValorTotal, l.locDesconto, l.locValorFinal,
                   c.cliId, c.cliNome, c.cliCPF_CNPJ, c.usuTelefone, c.usuEmail, 
                   u.usuId, u.usuNome, u.usuTelefone, u.usuEmail, u.usuPerfil,
                   ls.locStaId, ls.locStaDescricao
            FROM Locacao l
            JOIN Cliente c ON l.locCliId = c.cliId
            JOIN Usuario u ON l.locUsuId = u.usuId
            JOIN Locacao_Status ls ON l.locStatus = ls.locStaId
            WHERE l.locId = ?;
        `;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            return this.toMAP(rows)[0]; // Retorna apenas a primeira locação encontrada
        }
        return null;
    }

    async excluir(idLocacao) {
        let sql = "DELETE FROM Locacao WHERE locId = ?";
        let valores = [idLocacao];

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}