import { convertStringToType } from "oci-common";
import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";

const db = new Database();

export default class PecaModel {
    #pecaId;
    #pecaNome;
    #pecaDataAquisicao;
    #pecaDescricao;
    #pecaExibirCatalogo;
    #equipamentoStatus;
    #pecaPrecoVenda;
    #pecaPrecoHora;

    get pecaId() { return this.#pecaId; }
    set pecaId(pecaId) { this.#pecaId = pecaId; }

    get pecaNome() { return this.#pecaNome; }
    set pecaNome(pecaNome) { this.#pecaNome = pecaNome; }
    
    get pecaDataAquisicao() { return this.#pecaDataAquisicao; }
    set pecaDataAquisicao(pecaDataAquisicao) { this.#pecaDataAquisicao = pecaDataAquisicao; }

    get pecaDescricao() { return this.#pecaDescricao; }
    set pecaDescricao(pecaDescricao) { this.#pecaDescricao = pecaDescricao; }

    get pecaExibirCatalogo() { return this.#pecaExibirCatalogo; }
    set pecaExibirCatalogo(pecaExibirCatalogo) { this.#pecaExibirCatalogo = pecaExibirCatalogo; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    get pecaPrecoVenda() { return this.#pecaPrecoVenda; }
    set pecaPrecoVenda(pecaPrecoVenda) { this.#pecaPrecoVenda = pecaPrecoVenda; }

    get pecaPrecoHora() { return this.#pecaPrecoHora; }
    set pecaPrecoHora(pecaPrecoHora) { this.#pecaPrecoHora = pecaPrecoHora; }

    constructor(pecaId, pecaNome, pecaDescricao, pecaDataAquisicao, equipamentoStatus, pecaExibirCatalogo, pecaPrecoVenda, pecaPrecoHora) {
        this.#pecaId = pecaId;
        this.#pecaNome = pecaNome;
        this.#pecaDataAquisicao = pecaDataAquisicao;
        this.#pecaDescricao = pecaDescricao;
        this.#equipamentoStatus = equipamentoStatus;
        this.#pecaExibirCatalogo = pecaExibirCatalogo;
        this.#pecaPrecoVenda = pecaPrecoVenda;
        this.#pecaPrecoHora = pecaPrecoHora;
    }

    toJSON() {
        return {
            "pecaId": this.#pecaId,
            "pecaNome": this.#pecaNome,
            "pecaDataAquisicao": this.#pecaDataAquisicao,
            "pecaDescricao": this.#pecaDescricao,
            "pecaExibirCatalogo": this.#pecaExibirCatalogo,
            "equipamentoStatus": this.#equipamentoStatus,
            "pecaPrecoVenda": this.#pecaPrecoVenda,
            "pecaPrecoHora": this.#pecaPrecoHora
        };
    }

    toMAP(rows) {
        const listaPecas = [];

        rows.forEach(peca => {
            const equipamentoStatus = new EquipamentoStatusModel(
                peca["equipamentoStatusId"],
                peca["eqpStaDescricao"]
            );

            listaPecas.push(new PecaModel(
                peca["pecId"],
                peca["pecNome"],
                peca["pecDescricao"],
                peca["pecDataAquisicao"],
                equipamentoStatus,
                peca["pecExibirCatalogo"],
                peca["pecPrecoVenda"],
                peca["pecPrecoHora"]
            ));
        });
        return listaPecas;
    }

    async listarPecas() {
        const sql = `
            SELECT p.pecId, p.pecNome, p.pecDataAquisicao, p.pecDescricao, p.pecExibirCatalogo, 
                p.pecPrecoVenda, p.pecPrecoHora,
                es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Peca p
            JOIN Equipamento_Status es ON p.pecStatus = es.eqpStaId
            ORDER BY p.pecNome ASC`;

        const rows = await db.ExecutaComando(sql);
        const listaPecas = this.toMAP(rows);

        return listaPecas;
    }

    async gravar() {
        let sql = "";
        let valores = [];
        let result;
    
        if (this.#pecaId == 0 || this.#pecaId == null) {
            // Inserção
            sql = `INSERT INTO Peca (pecNome, pecDescricao, pecDataAquisicao, pecExibirCatalogo, 
                        pecPrecoVenda, pecPrecoHora, pecStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.#pecaExibirCatalogo, 
                this.#pecaPrecoVenda, this.#pecaPrecoHora, this.equipamentoStatus];
    
            result = await db.ExecutaComandoNonQuery(sql, valores);
    
            // Recupera o último ID inserido
            const lastInsertIdResult = await db.ExecutaComando(`SELECT LAST_INSERT_ID() AS lastId`);
            return lastInsertIdResult[0].lastId;
        } 
        else {
            // Alteração
            sql = `UPDATE Peca SET pecNome = ?, pecDescricao = ?, pecDataAquisicao = ?, pecStatus = ?, pecExibirCatalogo = ?, 
                   pecPrecoVenda = ?, pecPrecoHora = ? WHERE pecId = ?`;
            valores = [ this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.equipamentoStatus, 
                this.#pecaExibirCatalogo, this.#pecaPrecoVenda, this.#pecaPrecoHora, this.#pecaId];
    
            result = await db.ExecutaComandoNonQuery(sql, valores);
            return result;
        }
    }    

    async obter(id) {
        let sql = `SELECT Peca.pecId, Peca.pecNome, Peca.pecDataAquisicao, Peca.pecDescricao, Peca.pecExibirCatalogo, 
                          Peca.pecPrecoVenda, Peca.pecPrecoHora, Peca.pecStatus,
                          Equipamento_Status.eqpStaDescricao
                    FROM Peca 
                    INNER JOIN Equipamento_Status ON Peca.pecStatus = Equipamento_Status.eqpStaId
                    WHERE Peca.pecId = ?;`;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if(rows.length > 0) {           
            return rows;
        }
        return null;
    }

    async isLocado(idPeca) {
        let sql = `SELECT Peca.pecId, Peca.pecNome
                    FROM Peca
                    WHERE Peca.pecStatus = 2
                    AND Peca.pecId = ?`;
        let valores = [idPeca]

        let rows = await db.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    async isManutencao(idPeca) {
        let sql = `SELECT Peca.pecId, Peca.pecNome
                    FROM Peca
                    WHERE Peca.pecStatus = 3
                    AND Peca.pecId = ?`;
        let valores = [idPeca]

        let rows = await db.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    async excluir(idPeca) {
        let sql = "DELETE FROM Peca WHERE pecId = ?";
        let valores = [idPeca];

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async atualizarStatus(pecId, status) {
        const sql = `UPDATE Peca SET pecStatus = ? WHERE pecId = ?;`;
        const valores = [status, pecId];
        
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarPecasDisponiveis(idPeca) {
        let sql = `SELECT Peca.pecId, Peca.pecNome, Peca.pecPrecoHora
                    FROM Peca
                    WHERE Peca.pecStatus = 1`;
        let valores = [idPeca]

        let rows = await db.ExecutaComando(sql, valores);
        return rows;
    }

    async alterarExibicao(pecId, exibir) {
        const sql = `UPDATE Peca SET pecExibirCatalogo = ? WHERE pecId = ?`;
        const valores = [exibir, pecId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}