import { isReadableStream } from "oci-common/lib/helper.js";
import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils/index.js";

const db = new Database();

export default class ImplementoModel {
    #impId;
    #impNome;
    #impDataAquisicao;
    #impDescricao;
    #impExibirCatalogo;
    #equipamentoStatus;
    #impPrecoVenda;
    #impPrecoHora;

    get impId() { return this.#impId; }
    set impId(impId) { this.#impId = impId; }

    get impNome() { return this.#impNome; }
    set impNome(impNome) { this.#impNome = impNome; }
    
    get impDataAquisicao() { return this.#impDataAquisicao; }
    set impDataAquisicao(impDataAquisicao) { this.#impDataAquisicao = impDataAquisicao; }

    get impDescricao() { return this.#impDescricao; }
    set impDescricao(impDescricao) { this.#impDescricao = impDescricao; }

    get impExibirCatalogo() { return this.#impExibirCatalogo; }
    set impExibirCatalogo(impExibirCatalogo) { this.#impExibirCatalogo = impExibirCatalogo; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    get impPrecoVenda() { return this.#impPrecoVenda; }
    set impPrecoVenda(impPrecoVenda) { this.#impPrecoVenda = impPrecoVenda; }

    get impPrecoHora() { return this.#impPrecoHora; }
    set impPrecoHora(impPrecoHora) { this.#impPrecoHora = impPrecoHora; }

    constructor(impId, impNome, impDescricao, impDataAquisicao, equipamentoStatus, impExibirCatalogo, impPrecoVenda, impPrecoHora) {
        this.#impId = impId;
        this.#impNome = impNome;
        this.#impDataAquisicao = impDataAquisicao;
        this.#impDescricao = impDescricao;
        this.#equipamentoStatus = equipamentoStatus;
        this.#impExibirCatalogo = impExibirCatalogo;
        this.#impPrecoVenda = impPrecoVenda;
        this.#impPrecoHora = impPrecoHora;
    }

    toJSON() {
        return {
            "impId": this.#impId,
            "impNome": this.#impNome,
            "impDataAquisicao": this.#impDataAquisicao,
            "impDescricao": this.#impDescricao,
            "impExibirCatalogo": this.#impExibirCatalogo,
            "equipamentoStatus": this.#equipamentoStatus,
            "impPrecoVenda": this.#impPrecoVenda,
            "impPrecoHora": this.#impPrecoHora
        };
    }

    toMAP(rows) {
        const listaImplementos = [];

        rows.forEach(implemento => {
            const equipamentoStatus = new EquipamentoStatusModel(
                implemento["equipamentoStatusId"],
                implemento["eqpStaDescricao"]
            );

            listaImplementos.push(new ImplementoModel(
                implemento["impId"],
                implemento["impNome"],
                implemento["impDescricao"],
                implemento["impDataAquisicao"],
                equipamentoStatus,
                implemento["impExibirCatalogo"],
                implemento["impPrecoVenda"],
                implemento["impPrecoHora"]
            ));
        });
        return listaImplementos;
    }

    async listarImplementos() {
        const sql = `
            SELECT i.impId, i.impNome, i.impDataAquisicao, i.impDescricao, i.impExibirCatalogo, 
                i.impPrecoVenda, i.impPrecoHora,
                es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Implemento i
            JOIN Equipamento_Status es ON i.impStatus = es.eqpStaId
            ORDER BY i.impNome ASC`;

        const rows = await db.ExecutaComando(sql);
        const listaImplementos = this.toMAP(rows);

        return listaImplementos;
    }

    async gravar() {
        let sql = "";
        let valores = [];
        let result;

        if (this.#impId == 0 || this.#impId == null) {
            // Inserção
            sql = `INSERT INTO Implemento (impNome, impDescricao, impDataAquisicao, impExibirCatalogo, impPrecoVenda, impPrecoHora, impStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#impNome, this.#impDescricao, this.#impDataAquisicao, this.#impExibirCatalogo, this.#impPrecoVenda, this.#impPrecoHora, this.equipamentoStatus];
       
            result = await db.ExecutaComandoNonQuery(sql, valores);
    
            // Recupera o último ID inserido
            const lastInsertIdResult = await db.ExecutaComando(`SELECT LAST_INSERT_ID() AS lastId`);
            return lastInsertIdResult[0].lastId;
        } else {
            // Alteração
            sql = `UPDATE Implemento SET impNome = ?, impDescricao = ?, impDataAquisicao = ?, impStatus = ?, impExibirCatalogo = ?, 
                   impPrecoVenda = ?, impPrecoHora = ? WHERE impId = ?`;
            valores = [this.#impNome, this.#impDescricao, this.#impDataAquisicao, this.equipamentoStatus, this.#impExibirCatalogo, this.#impPrecoVenda, this.#impPrecoHora, this.#impId];
        
            result = await db.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }

    async obter(id) {
        let sql = `SELECT Implemento.impId, Implemento.impNome, Implemento.impDataAquisicao, Implemento.impDescricao, Implemento.impExibirCatalogo, 
                          Implemento.impPrecoVenda, Implemento.impPrecoHora, Implemento.impStatus,
                          Equipamento_Status.eqpStaDescricao, Equipamento_Status.eqpStaId
                    FROM Implemento 
                    INNER JOIN Equipamento_Status ON Implemento.impStatus = Equipamento_Status.eqpStaId
                    WHERE Implemento.impId = ?;`;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if(rows.length > 0) {           
            return rows;
        }
        return null;
    }

    async isLocado(idImplemento) {
        let sql = `SELECT Implemento.impId, Implemento.impNome
                    FROM Implemento
                    WHERE Implemento.impStatus = 2
                    AND Implemento.impId = ?`;
        let valores = [idImplemento];

        let rows = await db.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    async isManutencao(idImplemento) {
        let sql = `SELECT Implemento.impId, Implemento.impNome
                    FROM Implemento
                    WHERE Implemento.impStatus = 3
                    AND Implemento.impId = ?`;
        let valores = [idImplemento];

        let rows = await db.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    async excluir(idImplemento) {
        let sql = "DELETE FROM Implemento WHERE impId = ?";
        let valores = [idImplemento];

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async atualizarStatus(impId, status) {
        const sql = `UPDATE Implemento SET impStatus = ? WHERE impId = ?;`;
        const valores = [status, impId];
        
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarImplementosDisponiveis(idImplemento) {
        let sql = `SELECT Implemento.impId, Implemento.impNome, Implemento.impPrecoHora
                    FROM Implemento
                    WHERE Implemento.impStatus = 1`;
        let valores = [idImplemento]

        let rows = await db.ExecutaComando(sql, valores);
        return rows;
    }

    async alterarExibicao(impId, exibir) {
        const sql = `UPDATE Implemento SET impExibirCatalogo = ? WHERE impId = ?`;
        const valores = [exibir, impId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}
