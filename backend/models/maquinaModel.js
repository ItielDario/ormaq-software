import Database from "../utils/database.js"

const db = new Database();

export default class MaquinaModel {
    #maqId;
    #maqNome;
    #maqDataAquisicao;
    #maqTipo;
    #maqDescricao;
    #impInativo;
    #maqHorasUso;
    #equipamentoStatusId;

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

    get equipamentoStatusId() { return this.#equipamentoStatusId; }
    set equipamentoStatusId(equipamentoStatusId) { this.#equipamentoStatusId = equipamentoStatusId; }

    constructor(maqId, maqNome, maqDataAquisicao, maqTipo, maqDescricao, impInativo, maqHorasUso, equipamentoStatusId) {
        this.#maqId = maqId;
        this.#maqNome = maqNome;
        this.#maqDataAquisicao = maqDataAquisicao;
        this.#maqTipo = maqTipo;
        this.#maqDescricao = maqDescricao;
        this.#impInativo = impInativo;
        this.#maqHorasUso = maqHorasUso;
        this.#equipamentoStatusId = equipamentoStatusId;
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
            "equipamentoStatusId": this.#equipamentoStatusId
        };
    }

    toMAP(rows){
        const listaMaquinas = []
        
        rows.forEach(maquina => {
            listaMaquinas.push(new MaquinaModel(maquina["maqId"], maquina["maqNome"], maquina["maqDataAquisicao"], maquina["maqTipo"], maquina["maqDescricao"], maquina["impInativo"], maquina["maqHorasUso"], maquina["equipamentoStatusId"]));
        });

        return listaMaquinas;
    }

    async listarMaquinas(){
        const sql = "SELECT * FROM maquina";
        const rows = await db.ExecutaComando(sql);
        const listaMaquinas = this.toMAP(rows);
        
        return listaMaquinas
    }
}
