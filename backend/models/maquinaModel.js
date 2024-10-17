import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";

const db = new Database();

export default class MaquinaModel {
    #maqId;
    #maqNome;
    #maqDataAquisicao;
    #maqTipo;
    #maqDescricao;
    #maqInativo;
    #maqHorasUso;
    #equipamentoStatus;

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

    get maqInativo() { return this.#maqInativo; }
    set maqInativo(maqInativo) { this.#maqInativo = maqInativo; }

    get maqHorasUso() { return this.#maqHorasUso; }
    set maqHorasUso(maqHorasUso) { this.#maqHorasUso = maqHorasUso; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    constructor(maqId, maqNome, maqDataAquisicao, maqTipo, maqHorasUso, equipamentoStatus, maqInativo, maqDescricao) {
        this.#maqId = maqId;
        this.#maqNome = maqNome;
        this.#maqDataAquisicao = maqDataAquisicao;
        this.#maqTipo = maqTipo;
        this.#maqHorasUso = maqHorasUso;
        this.#equipamentoStatus = equipamentoStatus; 
        this.#maqInativo = maqInativo;
        this.#maqDescricao = maqDescricao;
    }

    toJSON() {
        return {
            "maqId": this.#maqId,
            "maqNome": this.#maqNome,
            "maqDataAquisicao": this.#maqDataAquisicao,
            "maqTipo": this.#maqTipo,
            "maqDescricao": this.#maqDescricao,
            "maqInativo": this.#maqInativo,
            "maqHorasUso": this.#maqHorasUso,
            "equipamentoStatus": this.#equipamentoStatus
        };
    }

    toMAP(rows) {
        const listaMaquinas = [];
    
        rows.forEach(maquina => {
            const dataAquisicao = new Date(maquina["maqDataAquisicao"]);
            const dataFormatada = dataAquisicao.toISOString().split('T')[0];
            
            // Criando o objeto EquipamentoStatus 
            const equipamentoStatus = new EquipamentoStatusModel( 
                maquina["equipamentoStatusId"], 
                maquina["eqpStaDescricao"]
            );
    
            listaMaquinas.push(new MaquinaModel(
                maquina["maqId"],               // ID da máquina
                maquina["maqNome"],             // Nome da máquina
                dataFormatada,                  // Data de aquisição formatada
                maquina["maqTipo"],             // Tipo da máquina
                maquina["maqHorasUso"],         // Horas de uso
                equipamentoStatus,              // Status do equipamento como objeto
                maquina["maqInativo"],          // Se a máquina está inativa
                maquina["maqDescricao"]         // Descrição da máquina
            ));
        });
        return listaMaquinas;
    }
    
    async listarMaquinas() {
        const sql = `
            SELECT m.maqId, m.maqNome, m.maqDataAquisicao, m.maqTipo, m.maqDescricao, m.maqInativo, m.maqHorasUso, es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Maquina m
            JOIN Equipamento_Status es ON m.maqStatus = es.eqpStaId;`;

        const rows = await db.ExecutaComando(sql);
        const listaMaquinas = this.toMAP(rows);

        return listaMaquinas;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if(this.#maqId == 0 || this.#maqId == null) {
            //Inserção
            sql = `INSERT INTO Maquina (maqNome, maqDataAquisicao, maqTipo, maqDescricao, maqInativo, maqStatus, maqHorasUso) VALUES (?, ?, ?, ?, ?, ?, ?)`
            valores = [this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqDescricao, this.#maqInativo, this.#equipamentoStatus, this.#maqHorasUso, this.#maqId];
        }
        else{
            //Alteração
            sql = `UPDATE maquina SET maqNome = ?, maqDataAquisicao = ?, maqTipo = ?, maqDescricao = ?, maqHorasUso = ? where maqId = ?`
            valores = [this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqDescricao, this.#maqHorasUso, this.#maqId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = "SELECT * FROM Maquina WHERE maqId = ?";
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);

        if(rows.length > 0) {           
            return this.toMAP(rows)[0];
        }

        return null;
    }
}