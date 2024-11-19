import Database from "../utils/database.js";

const db = new Database();

export default class ItensLocacaoModel {
    #iteLocId;
    #iteLocValorUnitario;
    #iteLocPlanoAluguel;
    #iteLocQuantDias;
    #iteLocMaqId;
    #iteLocLocacaoId;

    get iteLocId() { return this.#iteLocId; }
    set iteLocId(iteLocId) { this.#iteLocId = iteLocId; }

    get iteLocValorUnitario() { return this.#iteLocValorUnitario; }
    set iteLocValorUnitario(iteLocValorUnitario) { this.#iteLocValorUnitario = iteLocValorUnitario; }

    get iteLocPlanoAluguel() { return this.#iteLocPlanoAluguel; }
    set iteLocPlanoAluguel(iteLocPlanoAluguel) { this.#iteLocPlanoAluguel = iteLocPlanoAluguel; }

    get iteLocQuantDias() { return this.#iteLocQuantDias; }
    set iteLocQuantDias(iteLocQuantDias) { this.#iteLocQuantDias = iteLocQuantDias; }

    get iteLocMaqId() { return this.#iteLocMaqId; }
    set iteLocMaqId(iteLocMaqId) { this.#iteLocMaqId = iteLocMaqId; }

    get iteLocLocacaoId() { return this.#iteLocLocacaoId; }
    set iteLocLocacaoId(iteLocLocacaoId) { this.#iteLocLocacaoId = iteLocLocacaoId; }

    constructor(iteLocId, iteLocValorUnitario, iteLocPlanoAluguel, iteLocQuantDias, iteLocMaqId, iteLocLocacaoId) {
        this.#iteLocId = iteLocId;
        this.#iteLocValorUnitario = iteLocValorUnitario;
        this.#iteLocPlanoAluguel = iteLocPlanoAluguel;
        this.#iteLocQuantDias = iteLocQuantDias;
        this.#iteLocMaqId = iteLocMaqId;
        this.#iteLocLocacaoId = iteLocLocacaoId;
    }

    toJSON() {
        return {
            iteLocId: this.#iteLocId,
            iteLocValorUnitario: this.#iteLocValorUnitario,
            iteLocPlanoAluguel: this.#iteLocPlanoAluguel,
            iteLocQuantDias: this.#iteLocQuantDias,
            iteLocMaqId: this.#iteLocMaqId,
            iteLocLocacaoId: this.#iteLocLocacaoId
        };
    }

    toMAP(rows) {
        return rows.map(item => new ItensLocacaoModel(
            item["iteLocId"],
            item["iteLocValorUnitario"],
            item["iteLocPlanoAluguel"],
            item["iteLocQuantDias"],
            item["iteLocMaqId"],
            item["iteLocLocacaoId"]
        ));
    }

    async gravar() {
        const sql = `
            INSERT INTO Itens_Locacao (iteLocValorUnitario, iteLocPlanoAluguel, iteLocQuantDias, iteLocMaqId, IteLocLocacaoId)
            VALUES (?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#iteLocValorUnitario,
            this.#iteLocPlanoAluguel,
            this.#iteLocQuantDias,
            this.#iteLocMaqId,
            this.#iteLocLocacaoId
        ];

        console.log(this.#iteLocValorUnitario,
            this.#iteLocPlanoAluguel,
            this.#iteLocQuantDias,
            this.#iteLocMaqId,
            this.#iteLocLocacaoId)

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
            SELECT iteLocId, iteLocValorUnitario, iteLocPlanoAluguel, iteLocQuantDias, iteLocMaqId, IteLocLocacaoId
            FROM Itens_Locacao
            WHERE IteLocLocacaoId = ?;
        `;
        const rows = await db.ExecutaComando(sql, [locacaoId]);
        return this.toMAP(rows);
    }

    async obter(id) {
        const sql = `
            SELECT 
                li.iteLocId, 
                li.iteLocValorUnitario, 
                li.iteLocPlanoAluguel, 
                li.iteLocQuantDias,
                m.maqId AS iteLocMaqId, 
                m.maqNome AS iteLocMaqNome
            FROM Itens_Locacao li
            LEFT JOIN Maquina m ON li.iteLocMaqId = m.maqId
            WHERE li.iteLocId = ?;
        `;
        const valores = [id];
        const rows = await db.ExecutaComando(sql, valores);
        return this.toMAP(rows);
    }
}