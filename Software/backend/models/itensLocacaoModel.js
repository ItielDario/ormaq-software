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

    async excluir(idLocacao) {
        const sql = "DELETE FROM Itens_Locacao WHERE IteLocLocacaoId = ?";
        const valores = [idLocacao];

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

    async obter(id) {
        let sql = `
            SELECT li.iteLocQuantidade, li.iteLocValorUnitario,
                COALESCE(m.maqId, p.pecId, i.impId) AS iteLocId,
                COALESCE(m.maqNome, p.pecNome, i.impNome) AS iteLocNome,
            CASE 
                WHEN m.maqId IS NOT NULL THEN 'Máquina'
                WHEN p.pecId IS NOT NULL THEN 'Peça'
                WHEN i.impId IS NOT NULL THEN 'Implemento'
            END AS iteLocTipo
            FROM Itens_Locacao li
            LEFT JOIN Maquina m ON li.iteLocMaqId = m.maqId
            LEFT JOIN Peca p ON li.iteLocPecId = p.pecId
            LEFT JOIN Implemento i ON li.iteLocImpId = i.impId
            WHERE li.IteLocLocacaoId = ?;
        `;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        return rows;
    }
}
