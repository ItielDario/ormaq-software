import Database from "../utils/database.js";

const db = new Database();

export default class MaquinaAluguelModel {
    #maqAluId;
    #maqId;
    #maqAluPrecoDiario;
    #maqAluPrecoSemanal;
    #maqAluPrecoQuinzenal;
    #maqAluPrecoMensal;

    get maqAluId() { return this.#maqAluId; }
    set maqAluId(maqAluId) { this.#maqAluId = maqAluId; }

    get maqId() { return this.#maqId; }
    set maqId(maqId) { this.#maqId = maqId; }

    get maqAluPrecoDiario() { return this.#maqAluPrecoDiario; }
    set maqAluPrecoDiario(maqAluPrecoDiario) { this.#maqAluPrecoDiario = maqAluPrecoDiario; }

    get maqAluPrecoSemanal() { return this.#maqAluPrecoSemanal; }
    set maqAluPrecoSemanal(maqAluPrecoSemanal) { this.#maqAluPrecoSemanal = maqAluPrecoSemanal; }

    get maqAluPrecoQuinzenal() { return this.#maqAluPrecoQuinzenal; }
    set maqAluPrecoQuinzenal(maqAluPrecoQuinzenal) { this.#maqAluPrecoQuinzenal = maqAluPrecoQuinzenal; }

    get maqAluPrecoMensal() { return this.#maqAluPrecoMensal; }
    set maqAluPrecoMensal(maqAluPrecoMensal) { this.#maqAluPrecoMensal = maqAluPrecoMensal; }

    constructor(maqAluId, maqId, maqAluPrecoDiario, maqAluPrecoSemanal, maqAluPrecoQuinzenal, maqAluPrecoMensal) {
        this.#maqAluId = maqAluId;
        this.#maqId = maqId;
        this.#maqAluPrecoDiario = maqAluPrecoDiario;
        this.#maqAluPrecoSemanal = maqAluPrecoSemanal;
        this.#maqAluPrecoQuinzenal = maqAluPrecoQuinzenal;
        this.#maqAluPrecoMensal = maqAluPrecoMensal;
    }

    toJSON() {
        return {
            "maqAluId": this.#maqAluId,
            "maqId": this.#maqId,
            "maqAluPrecoDiario": this.#maqAluPrecoDiario,
            "maqAluPrecoSemanal": this.#maqAluPrecoSemanal,
            "maqAluPrecoQuinzenal": this.#maqAluPrecoQuinzenal,
            "maqAluPrecoMensal": this.#maqAluPrecoMensal
        };
    }

    toMAP(rows) {
        return rows.map(item => new MaquinaAluguelModel(
            item["maqAluId"],
            item["maqId"],
            item["maqAluPrecoDiario"],
            item["maqAluPrecoSemanal"],
            item["maqAluPrecoQuinzenal"],
            item["maqAluPrecoMensal"]
        ));
    }

    async gravar() {
        const sql = `
            INSERT INTO Maquina_Aluguel (maqId, maqAluPrecoDiario, maqAluPrecoSemanal, maqAluPrecoQuinzenal, maqAluPrecoMensal)
            VALUES (?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#maqId,
            this.#maqAluPrecoDiario,
            this.#maqAluPrecoSemanal,
            this.#maqAluPrecoQuinzenal,
            this.#maqAluPrecoMensal
        ];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir(maqId) {
        const sql = "DELETE FROM Maquina_Aluguel WHERE maqId = ?";
        const valores = [maqId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarPorMaquina(maqId) {
        const sql = `
            SELECT maqAluId, maqId, maqAluPrecoDiario, maqAluPrecoSemanal, maqAluPrecoQuinzenal, maqAluPrecoMensal
            FROM Maquina_Aluguel
            WHERE maqId = ?;
        `;
        const rows = await db.ExecutaComando(sql, [maqId]);
        return this.toMAP(rows);
    }

    async obter(maqAluId) {
        const sql = `
            SELECT maqAluId, maqId, maqAluPrecoDiario, maqAluPrecoSemanal, maqAluPrecoQuinzenal, maqAluPrecoMensal
            FROM Maquina_Aluguel
            WHERE maqId = ?;
        `;
        const rows = await db.ExecutaComando(sql, [maqAluId]);
        return rows[0];
    }
}