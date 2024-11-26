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
            WHERE IteLocLocacaoId = ?
            
            SELECT 
                IL.iteLocId, 
                IL.iteLocValorUnitario, 
                IL.iteLocPlanoAluguel, 
                IL.iteLocQuantDias, 
                IL.iteLocMaqId, 
                IL.IteLocLocacaoId,
                M.maqId, 
                M.maqNome, 
                M.maqTipo, 
                M.maqModelo, 
                M.maqSerie, 
                M.maqAnoFabricacao, 
                M.maqDescricao, 
                M.maqPrecoVenda,
                L.locId,
                img.imgId AS maqImgId,            
                img.imgUrl AS maqImagem,         
                img.imgNome AS maqImgNome 
            FROM Itens_Locacao IL
            JOIN Maquina M 
            ON IL.iteLocMaqId = M.maqId
            JOIN Locacao L
            ON IL.IteLocLocacaoId = L.locId
            LEFT JOIN Imagens_Equipamento img 
            ON M.maqId = img.imgMaqId AND img.imgPrincipal = TRUE
            WHERE L.IteLocLocacaoId = ?;
        `;
        const rows = await db.ExecutaComando(sql, [locacaoId]);
        return this.toMAP(rows);
    }

    async obter(id) {
        const sql = `
            SELECT 
                IL.iteLocId, 
                IL.iteLocValorUnitario, 
                IL.iteLocPlanoAluguel, 
                IL.iteLocQuantDias, 
                IL.iteLocMaqId, 
                IL.IteLocLocacaoId,
                M.maqId, 
                M.maqNome, 
                M.maqTipo, 
                M.maqModelo, 
                M.maqSerie, 
                M.maqAnoFabricacao, 
                M.maqDescricao,
                M.maqHorasUso, 
                M.maqPrecoVenda,
                L.locId,
                img.imgId AS maqImgId,            
                img.imgUrl AS maqImagem,         
                img.imgNome AS maqImgNome 
            FROM Itens_Locacao IL
            JOIN Maquina M 
            ON IL.iteLocMaqId = M.maqId
            JOIN Locacao L
            ON IL.IteLocLocacaoId = L.locId
            LEFT JOIN Imagens_Equipamento img 
            ON M.maqId = img.imgMaqId AND img.imgPrincipal = TRUE
            WHERE L.locId = ?;
        `;
        const valores = [id];
        const rows = await db.ExecutaComando(sql, valores);
        return rows;
    }
}