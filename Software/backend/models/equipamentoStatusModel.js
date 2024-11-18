import Database from "../utils/database.js";

const db = new Database();

export default class EquipamentoStatusModel {
    #equipamentoStatusId;
    #equipamentoStatusDescricao;

    get equipamentoStatusId() { return this.#equipamentoStatusId; }
    set equipamentoStatusId(equipamentoStatusId) { this.#equipamentoStatusId = equipamentoStatusId; }

    get equipamentoStatusDescricao() { return this.#equipamentoStatusDescricao; }
    set equipamentoStatusDescricao(equipamentoStatusDescricao) { this.#equipamentoStatusDescricao = equipamentoStatusDescricao; }

    constructor(equipamentoStatusId, equipamentoStatusDescricao) {
        this.#equipamentoStatusId = equipamentoStatusId;
        this.#equipamentoStatusDescricao = equipamentoStatusDescricao;
    }

    toJSON() {
        return {
            "equipamentoStatusId": this.#equipamentoStatusId,
            "equipamentoStatusDescricao": this.#equipamentoStatusDescricao
        };
    }

    static toMAP(rows) {
        return rows.map(row => new EquipamentoStatusModel(row["eqpStaId"], row["eqpStaDescricao"]));
    }
}
