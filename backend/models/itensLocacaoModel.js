import Database from "../utils/database.js";

const db = new Database();

export default class ItensLocacaoModel {
    #iteLocId;
    #iteLocQuantidade;
    #iteLocValorUnitario;
    #iteLocPecId;
    #iteLocImpId;
    #iteLocMaqId;
    #IteLocLocacaoId;

    get iteLocId() { return this.#iteLocId; }
    set iteLocId(iteLocId) { this.#iteLocId = iteLocId; }

    get iteLocQuantidade() { return this.#iteLocQuantidade; }
    set iteLocQuantidade(iteLocQuantidade) { this.#iteLocQuantidade = iteLocQuantidade; }

    get iteLocValorUnitario() { return this.#iteLocValorUnitario; }
    set iteLocValorUnitario(iteLocValorUnitario) { this.#iteLocValorUnitario = iteLocValorUnitario; }

    get iteLocPecId() { return this.#iteLocPecId; }
    set iteLocPecId(iteLocPecId) { this.#iteLocPecId = iteLocPecId; }

    get iteLocImpId() { return this.#iteLocImpId; }
    set iteLocImpId(iteLocImpId) { this.#iteLocImpId = iteLocImpId; }

    get iteLocMaqId() { return this.#iteLocMaqId; }
    set iteLocMaqId(iteLocMaqId) { this.#iteLocMaqId = iteLocMaqId; }

    get IteLocLocacaoId() { return this.#IteLocLocacaoId; }
    set IteLocLocacaoId(IteLocLocacaoId) { this.#IteLocLocacaoId = IteLocLocacaoId; }

    constructor(iteLocId, iteLocQuantidade, iteLocValorUnitario, iteLocPecId, iteLocImpId, iteLocMaqId, IteLocLocacaoId) {
        this.#iteLocId = iteLocId;
        this.#iteLocQuantidade = iteLocQuantidade;
        this.#iteLocValorUnitario = iteLocValorUnitario;
        this.#iteLocPecId = iteLocPecId;
        this.#iteLocImpId = iteLocImpId;
        this.#iteLocMaqId = iteLocMaqId;
        this.#IteLocLocacaoId = IteLocLocacaoId;
    }

    toJSON() {
        return {
            "iteLocId": this.#iteLocId,
            "iteLocQuantidade": this.#iteLocQuantidade,
            "iteLocValorUnitario": this.#iteLocValorUnitario,
            "iteLocPecId": this.#iteLocPecId,
            "iteLocImpId": this.#iteLocImpId,
            "iteLocMaqId": this.#iteLocMaqId,
            "IteLocLocacaoId": this.#IteLocLocacaoId
        };
    }

    toMAP(rows) {
        return rows.map(item => new ItensLocacaoModel(
            item["iteLocId"],
            item["iteLocQuantidade"],
            item["iteLocValorUnitario"],
            item["iteLocPecId"],
            item["iteLocImpId"],
            item["iteLocMaqId"],
            item["IteLocLocacaoId"]
        ));
    }

    async gravar() {
        const sql = `
            INSERT INTO Itens_Locacao (iteLocQuantidade, iteLocValorUnitario, iteLocPecId, iteLocImpId, iteLocMaqId, IteLocLocacaoId)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#iteLocQuantidade,
            this.#iteLocValorUnitario,
            this.#iteLocPecId,
            this.#iteLocImpId,
            this.#iteLocMaqId,
            this.#IteLocLocacaoId
        ];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir() {
        const sql = "DELETE FROM Itens_Locacao WHERE iteLocId = ?";
        const valores = [this.#iteLocId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarItensPorLocacao(locacaoId) {
        const sql = `
            SELECT iteLocId, iteLocQuantidade, iteLocValorUnitario, iteLocPecId, iteLocImpId, iteLocMaqId, IteLocLocacaoId
            FROM Itens_Locacao
            WHERE IteLocLocacaoId = ?;
        `;
        const rows = await db.ExecutaComando(sql, [locacaoId]);
        return this.toMAP(rows);
    }
}
