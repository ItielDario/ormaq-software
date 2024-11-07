import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";

const db = new Database();

export default class PecaModel {
    #pecaId;
    #pecaNome;
    #pecaDataAquisicao;
    #pecaDescricao;
    #pecaInativo;
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

    get pecaInativo() { return this.#pecaInativo; }
    set pecaInativo(pecaInativo) { this.#pecaInativo = pecaInativo; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    get pecaPrecoVenda() { return this.#pecaPrecoVenda; }
    set pecaPrecoVenda(pecaPrecoVenda) { this.#pecaPrecoVenda = pecaPrecoVenda; }

    get pecaPrecoHora() { return this.#pecaPrecoHora; }
    set pecaPrecoHora(pecaPrecoHora) { this.#pecaPrecoHora = pecaPrecoHora; }

    constructor(pecaId, pecaNome, pecaDescricao, pecaDataAquisicao, equipamentoStatus, pecaInativo, pecaPrecoVenda, pecaPrecoHora) {
        this.#pecaId = pecaId;
        this.#pecaNome = pecaNome;
        this.#pecaDataAquisicao = pecaDataAquisicao;
        this.#pecaDescricao = pecaDescricao;
        this.#equipamentoStatus = equipamentoStatus;
        this.#pecaInativo = pecaInativo;
        this.#pecaPrecoVenda = pecaPrecoVenda;
        this.#pecaPrecoHora = pecaPrecoHora;
    }

    toJSON() {
        return {
            "pecaId": this.#pecaId,
            "pecaNome": this.#pecaNome,
            "pecaDataAquisicao": this.#pecaDataAquisicao,
            "pecaDescricao": this.#pecaDescricao,
            "pecaInativo": this.#pecaInativo,
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
                peca["pecInativo"],
                peca["pecPrecoVenda"],
                peca["pecPrecoHora"]
            ));
        });
        return listaPecas;
    }

    async listarPecas() {
        const sql = `
            SELECT p.pecId, p.pecNome, p.pecDataAquisicao, p.pecDescricao, p.pecInativo, 
                   p.pecPrecoVenda, p.pecPrecoHora,
                   es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Peca p
            JOIN Equipamento_Status es ON p.pecStatus = es.eqpStaId;`;

        const rows = await db.ExecutaComando(sql);
        const listaPecas = this.toMAP(rows);

        return listaPecas;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#pecaId == 0 || this.#pecaId == null) {
            // Inserção
            sql = `INSERT INTO Peca (pecNome, pecDescricao, pecDataAquisicao, pecInativo, pecPrecoVenda, pecPrecoHora, pecStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.#pecaInativo, this.#pecaPrecoVenda, this.#pecaPrecoHora, this.equipamentoStatus];
        } else {
            // Alteração
            sql = `UPDATE Peca SET pecNome = ?, pecDescricao = ?, pecDataAquisicao = ?, pecStatus = ?, pecInativo = ?, 
                   pecPrecoVenda = ?, pecPrecoHora = ? WHERE pecId = ?`;
            valores = [this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.equipamentoStatus, this.#pecaInativo, this.#pecaPrecoVenda, this.#pecaPrecoHora, this.#pecaId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = `SELECT Peca.pecId, Peca.pecNome, Peca.pecDataAquisicao, Peca.pecDescricao, Peca.pecInativo, 
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
}