import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";

const db = new Database();

export default class ImplementoModel {
    #impId;
    #impNome;
    #impDataAquisicao;
    #impDescricao;
    #impInativo;
    #equipamentoStatus;

    get impId() { return this.#impId; }
    set impId(impId) { this.#impId = impId; }

    get impNome() { return this.#impNome; }
    set impNome(impNome) { this.#impNome = impNome; }
    
    get impDataAquisicao() { return this.#impDataAquisicao; }
    set impDataAquisicao(impDataAquisicao) { this.#impDataAquisicao = impDataAquisicao; }

    get impDescricao() { return this.#impDescricao; }
    set impDescricao(impDescricao) { this.#impDescricao = impDescricao; }

    get impInativo() { return this.#impInativo; }
    set impInativo(impInativo) { this.#impInativo = impInativo; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    constructor(impId, impNome, impDescricao, impDataAquisicao, equipamentoStatus, impInativo) {
        this.#impId = impId;
        this.#impNome = impNome;
        this.#impDataAquisicao = impDataAquisicao;
        this.#impDescricao = impDescricao;
        this.#equipamentoStatus = equipamentoStatus; 
        this.#impInativo = impInativo;
    }

    toJSON() {
        return {
            "impId": this.#impId,
            "impNome": this.#impNome,
            "impDataAquisicao": this.#impDataAquisicao,
            "impDescricao": this.#impDescricao,
            "impInativo": this.#impInativo,
            "equipamentoStatus": this.#equipamentoStatus
        };
    }

    toMAP(rows) {
        const listaImplementos = [];

        rows.forEach(implemento => {
            // Criando o objeto EquipamentoStatus
            const equipamentoStatus = new EquipamentoStatusModel(
                implemento["impStatus"], 
                implemento["eqpStaDescricao"]
            );

            listaImplementos.push(new ImplementoModel(
                implemento["impId"],                   // ID do implemento
                implemento["impNome"],                 // Nome do implemento
                implemento["impDescricao"],            // Descrição do implemento
                implemento["impDataAquisicao"],        // Data de aquisição
                equipamentoStatus,                     // Status do equipamento como objeto
                implemento["impInativo"]               // Se o implemento está inativo
            ));
        });
        return listaImplementos;
    }

    async listarImplementos() {
        const sql = `
            SELECT i.impId, i.impNome, i.impDataAquisicao, i.impDescricao, i.impInativo, es.eqpStaId AS impStatus, es.eqpStaDescricao
            FROM Implemento i
            JOIN Equipamento_Status es ON i.impStatus = es.eqpStaId;`;

        const rows = await db.ExecutaComando(sql);
        const listaImplementos = this.toMAP(rows);

        return listaImplementos;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#impId == 0 || this.#impId == null) {
            // Inserção
            sql = `INSERT INTO Implemento (impNome, impDescricao, impDataAquisicao, impStatus, impInativo) VALUES (?, ?, ?, ?, ?)`;
            valores = [this.#impNome, this.#impDescricao, this.#impDataAquisicao, this.#equipamentoStatus, this.#impInativo, this.#impId];
        } else {
            // Alteração
            sql = `UPDATE Implemento SET impNome = ?, impDescricao = ?, impDataAquisicao = ?, impInativo = ? WHERE impId = ?`;
            valores = [this.#impNome, this.#impDescricao, this.#impDataAquisicao, this.#impInativo, this.#impId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = `SELECT Implemento.impId, Implemento.impNome, Implemento.impDataAquisicao, Implemento.impDescricao, Implemento.impStatus, Implemento.impInativo, Equipamento_Status.eqpStaDescricao
                    FROM Implemento INNER JOIN Equipamento_Status
                    ON Implemento.impStatus = Equipamento_Status.eqpStaId
                    WHERE Implemento.impId = ?`;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if(rows.length > 0) {           
            return rows;
        }
        return null;
    }
}