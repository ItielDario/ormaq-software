import Database from "../utils/database.js";
import ClienteModel from "./clienteModel.js";
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
    #locPrecoHoraExtra;  
    #cliente;
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

    get locPrecoHoraExtra() { return this.#locPrecoHoraExtra; }  
    set locPrecoHoraExtra(locPrecoHoraExtra) { this.#locPrecoHoraExtra = locPrecoHoraExtra; } 

    get cliente() { return this.#cliente; }
    set cliente(cliente) { this.#cliente = cliente; }

    get locacaoStatus() { return this.#locacaoStatus; }
    set locacaoStatus(locacaoStatus) { this.#locacaoStatus = locacaoStatus; }

    constructor(locId, locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locPrecoHoraExtra, cliente, locacaoStatus) {
        this.#locId = locId;
        this.#locDataInicio = locDataInicio;
        this.#locDataFinalPrevista = locDataFinalPrevista;
        this.#locDataFinalEntrega = locDataFinalEntrega;
        this.#locValorTotal = locValorTotal;
        this.#locDesconto = locDesconto;
        this.#locValorFinal = locValorFinal;
        this.#locPrecoHoraExtra = locPrecoHoraExtra;  
        this.#cliente = cliente;
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
            "locPrecoHoraExtra": this.#locPrecoHoraExtra, 
            "cliente": this.#cliente,
            "locacaoStatus": this.#locacaoStatus
        };
    }

    toMAP(rows) {
        const listaLocacoes = [];

        rows.forEach(locacao => {
            // Criando os objetos Cliente, Usuario e LocacaoStatus
            const cliente = new ClienteModel(locacao["cliId"], locacao["cliNome"], locacao["cliCPF_CNPJ"], locacao["cliTelefone"], locacao["cliEmail"]);
            const locacaoStatus = new LocacaoStatusModel(locacao["locStatusId"], locacao["locStaDescricao"]);

            listaLocacoes.push(new LocacaoModel(
                locacao["locId"],                   // ID da locação
                locacao["locDataInicio"],           // Data de início
                locacao["locDataFinalPrevista"],    // Data final prevista
                locacao["locDataFinalEntrega"],     // Data de entrega
                locacao["locValorTotal"],           // Valor total
                locacao["locDesconto"],             // Desconto
                locacao["locValorFinal"],           // Valor final
                locacao["locPrecoHoraExtra"],       // Preço hora extra
                cliente,                            // Cliente
                usuario,                            // Usuário
                locacaoStatus                       // Status da locação
            ));
        });
        return listaLocacoes;
    }

    async listarLocacoes() {
        const sql = `
            SELECT l.locId, l.locDataInicio, l.locDataFinalPrevista, l.locDataFinalEntrega, l.locValorTotal, l.locDesconto, l.locValorFinal, l.locPrecoHoraExtra,
                c.cliId, c.cliNome, c.cliCPF_CNPJ, c.cliTelefone, c.cliEmail, 
                ls.locStaId AS locStatusId, ls.locStaDescricao
            FROM Locacao l
            JOIN Cliente c ON l.locCliId = c.cliId
            JOIN Locacao_Status ls ON l.locStatus = ls.locStaId
            ORDER BY 
                CASE 
                    WHEN ls.locStaId = 1 THEN 0 
                    ELSE 1
                END,
            l.locDataInicio DESC`;

        const rows = await db.ExecutaComando(sql);
        return rows;
    }

    async gravar() {
        let sql = "";
        let valores = [];
        let result;

        if (this.#locId == 0 || this.#locId == null) {
            // Inserção
            sql = `INSERT INTO Locacao (locDataInicio, locDataFinalPrevista, locDataFinalEntrega, locValorTotal, locDesconto, locValorFinal, locPrecoHoraExtra, locCliId, locStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#locDataInicio, this.#locDataFinalPrevista, this.#locDataFinalEntrega, this.#locValorTotal, this.#locDesconto, this.#locValorFinal, this.#locPrecoHoraExtra, this.#cliente, this.#locacaoStatus];

            // Executa o comando e recupera o ID da última inserção
            result = await db.ExecutaComandoNonQuery(sql, valores);
            if (result) {
                const lastId = await db.ExecutaComando(`SELECT LAST_INSERT_ID() AS locId`);
                return lastId[0].locId;
            }
        } else {
            // Alteração
            sql = `UPDATE Locacao SET locDataInicio = ?, locDataFinalPrevista = ?, locDataFinalEntrega = ?, locValorTotal = ?, locDesconto = ?, locValorFinal = ?, locPrecoHoraExtra = ?, locStatus = ?, locCliId = ? WHERE locId = ?`;
            valores = [this.#locDataInicio, this.#locDataFinalPrevista, this.#locDataFinalEntrega, this.#locValorTotal, this.#locDesconto, this.#locValorFinal, this.#locPrecoHoraExtra, this.#locacaoStatus, this.#cliente, this.#locId];

            result = await db.ExecutaComandoNonQuery(sql, valores);
            return result;
        }

        return null;
    }

    async obter(id) {
        let sql = `
            SELECT l.locId, l.locDataInicio, l.locDataFinalPrevista, l.locDataFinalEntrega, l.locValorTotal, l.locDesconto, l.locValorFinal, l.locPrecoHoraExtra, 
                c.cliId, c.cliNome, c.cliCPF_CNPJ, c.cliTelefone, c.cliEmail,
                ls.locStaId AS locStatusId, ls.locStaDescricao
            FROM Locacao l
            JOIN Cliente c ON l.locCliId = c.cliId
            JOIN Locacao_Status ls ON l.locStatus = ls.locStaId
            WHERE locId = ?`;

        const rows = await db.ExecutaComando(sql, [id]);

        
        return rows;
    }

    async excluir(idLocacao) {
        let sql = "DELETE FROM Locacao WHERE locId = ?";
        let valores = [idLocacao];

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async finalizar() {
        const sql = `UPDATE Locacao SET locDataFinalEntrega = ?, locPrecoHoraExtra = ?, locValorFinal = ?, locStatus = ? WHERE locId = ?`;
        const valores = [this.#locDataFinalEntrega, this.locPrecoHoraExtra, this.#locValorFinal, this.locacaoStatus, this.#locId];
        
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}