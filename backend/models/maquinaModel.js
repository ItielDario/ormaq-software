import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js"; // Importando a nova model

const db = new Database();

export default class MaquinaModel {
    #maqId;
    #maqNome;
    #maqDataAquisicao;
    #maqTipo;
    #maqDescricao;
    #impInativo;
    #maqHorasUso;
    #equipamentoStatus; // Agora um objeto do tipo EquipamentoStatusModel

    get maqId() { return this.#maqId; }
    set maqId(maqId) { this.#maqId = maqId; }

    get maqNome() { return this.#maqNome; }
    set maqNome(maqNome) { this.#maqNome = maqNome; }

    get maqDataAquisicao() { return this.#maqDataAquisicao; }
    set maqDataAquisicao(maqDataAquisicao) { this.#maqDataAquisicao = maqDataAquisicao; }

    get maqTipo() { return this.#maqTipo; }
    set maqTipo(maqTipo) { this.#maqTipo = maqTipo; }

    get maqDescricao() { return this.#maqDescricao; }
    set maqDescricao(maqDescricao) { this.#maqDescricao = maqDescricao; }

    get impInativo() { return this.#impInativo; }
    set impInativo(impInativo) { this.#impInativo = impInativo; }

    get maqHorasUso() { return this.#maqHorasUso; }
    set maqHorasUso(maqHorasUso) { this.#maqHorasUso = maqHorasUso; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    constructor(maqId, maqNome, maqDataAquisicao, maqTipo, maqDescricao, impInativo, maqHorasUso, equipamentoStatus) {
        this.#maqId = maqId;
        this.#maqNome = maqNome;
        this.#maqDataAquisicao = maqDataAquisicao;
        this.#maqTipo = maqTipo;
        this.#maqDescricao = maqDescricao;
        this.#impInativo = impInativo;
        this.#maqHorasUso = maqHorasUso;
        this.#equipamentoStatus = equipamentoStatus; 
    }

    toJSON() {
        return {
            "maqId": this.#maqId,
            "maqNome": this.#maqNome,
            "maqDataAquisicao": this.#maqDataAquisicao,
            "maqTipo": this.#maqTipo,
            "maqDescricao": this.#maqDescricao,
            "impInativo": this.#impInativo,
            "maqHorasUso": this.#maqHorasUso,
            "equipamentoStatus": this.#equipamentoStatus
        };
    }

    toMAP(rows) {
        const listaMaquinas = [];

        rows.forEach(maquina => {
            const dataAquisicao = new Date(maquina["maqDataAquisicao"]);
            const dataFormatada = dataAquisicao.toISOString().split('T')[0];

            const equipamentoStatus = new EquipamentoStatusModel(maquina["equipamentoStatusId"], maquina["eqpStaDescricao"]);

            console.log(equipamentoStatus)

            listaMaquinas.push(new MaquinaModel(
                maquina["maqId"],
                maquina["maqNome"],
                dataFormatada,
                maquina["maqTipo"],
                maquina["maqDescricao"],
                maquina["impInativo"],
                maquina["maqHorasUso"],
                equipamentoStatus // Passando o objeto EquipamentoStatus
            ));
        });

        return listaMaquinas;
    }

    async listarMaquinas() {
        console.log('aaaaaaaaaaa')
        const sql = `
            SELECT m.maqId, m.maqNome, m.maqDataAquisicao, m.maqTipo, m.maqInativo, m.maqHorasUso, es.eqpStaId, es.eqpStaDescricao
            FROM Maquina m
            JOIN Equipamento_Status es ON m.maqStatus = es.eqpStaId`;

        const rows = await db.ExecutaComando(sql);
        console.log(rows)
        const listaMaquinas = this.toMAP(rows);
        console.log(listaMaquinas)

        return listaMaquinas;
    }
}