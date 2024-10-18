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

    constructor(pecaId, pecaNome, pecaDescricao, pecaDataAquisicao, equipamentoStatus, pecaInativo) {
        this.#pecaId = pecaId;
        this.#pecaNome = pecaNome;
        this.#pecaDataAquisicao = pecaDataAquisicao;
        this.#pecaDescricao = pecaDescricao;
        this.#equipamentoStatus = equipamentoStatus; 
        this.#pecaInativo = pecaInativo;
    }

    toJSON() {
        return {
            "pecaId": this.#pecaId,
            "pecaNome": this.#pecaNome,
            "pecaDataAquisicao": this.#pecaDataAquisicao,
            "pecaDescricao": this.#pecaDescricao,
            "pecaInativo": this.#pecaInativo,
            "equipamentoStatus": this.#equipamentoStatus
        };
    }

    toMAP(rows) {
        const listaPecas = [];

        rows.forEach(peca => {
            // Criando o objeto EquipamentoStatus
            const equipamentoStatus = new EquipamentoStatusModel(
                peca["equipamentoStatusId"], 
                peca["eqpStaDescricao"] // Adicionando a descrição do status aqui
            );

            listaPecas.push(new PecaModel(
                peca["pecId"],                   // ID da peça
                peca["pecNome"],                 // Nome da peça
                peca["pecDescricao"],            // Descrição da peça
                peca["pecDataAquisicao"],        // Data de aquisição
                equipamentoStatus,               // Status do equipamento como objeto
                peca["pecInativo"]               // Se a peça está inativa
            ));
        });
        return listaPecas;
    }

    async listarPecas() {
        const sql = `
            SELECT p.pecId, p.pecNome, p.pecDataAquisicao, p.pecDescricao, p.pecInativo, es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
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
            sql = `INSERT INTO Peca (pecNome, pecDescricao, pecDataAquisicao, pecStatus, pecInativo) VALUES (?, ?, ?, ?, ?)`;
            valores = [this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.#equipamentoStatus, this.#pecaInativo];
        } else {
            // Alteração
            sql = `UPDATE Peca SET pecNome = ?, pecDescricao = ?, pecDataAquisicao = ?, pecInativo = ? WHERE pecId = ?`;
            valores = [this.#pecaNome, this.#pecaDescricao, this.#pecaDataAquisicao, this.#pecaInativo, this.#pecaId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = `SELECT Peca.pecId, Peca.pecNome, Peca.pecDataAquisicao, Peca.pecDescricao, Peca.pecInativo, Peca.pecStatus,Equipamento_Status.eqpStaDescricao
                    FROM Peca INNER JOIN Equipamento_Status
                    ON Peca.pecStatus = Equipamento_Status.eqpStaId
                    WHERE Peca.pecId = ?;`;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if(rows.length > 0) {           
            return rows;
        }
        return null;
    }
}