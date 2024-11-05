import Database from "../utils/database.js";
// import PecaModel from "./pecaModel.js";
// import ImplementoModel from "./implementoModel.js";
// import MaquinaModel from "./maquinaModel.js";

const db = new Database();

export default class ManutencaoModel {
    #manId;
    #manDataInicio;
    #manDataTermino;
    #manDescricao;
    #peca;         // ID da peça relacionada, se aplicável
    #implemento;   // ID do implemento relacionado, se aplicável
    #maquina;      // ID da máquina relacionada, se aplicável
    #manStatus;

    get manId() { return this.#manId; }
    set manId(manId) { this.#manId = manId; }

    get manDataInicio() { return this.#manDataInicio; }
    set manDataInicio(manDataInicio) { this.#manDataInicio = manDataInicio; }

    get manDataTermino() { return this.#manDataTermino; }
    set manDataTermino(manDataTermino) { this.#manDataTermino = manDataTermino; }

    get manDescricao() { return this.#manDescricao; }
    set manDescricao(manDescricao) { this.#manDescricao = manDescricao; }

    get peca() { return this.#peca; }
    set peca(peca) { this.#peca = peca; }

    get implemento() { return this.#implemento; }
    set implemento(implemento) { this.#implemento = implemento; }

    get maquina() { return this.#maquina; }
    set maquina(maquina) { this.#maquina = maquina; }

    get manStatus() { return this.#manStatus; }
    set manStatus(manStatus) { this.#manStatus = manStatus; }

    constructor(manId, manDataInicio, manDataTermino, manDescricao, peca, implemento, maquina, manStatus) {
        this.#manId = manId;
        this.#manDataInicio = manDataInicio;
        this.#manDataTermino = manDataTermino;
        this.#manDescricao = manDescricao;
        this.#peca = peca;
        this.#implemento = implemento;
        this.#maquina = maquina;
        this.#manStatus = manStatus;
    }

    toJSON() {
        return {
            "manId": this.#manId,
            "manDataInicio": this.#manDataInicio,
            "manDataTermino": this.#manDataTermino,
            "manDescricao": this.#manDescricao,
            "peca": this.#peca,
            "implemento": this.#implemento,
            "maquina": this.#maquina,
            "manStatus": this.#manStatus
        };
    }

    async listarManutencoes() {
        const sql = `
            SELECT m.manId, m.manDataInicio, m.manDataTermino, m.manDescricao, m.manStatus,
                COALESCE(ma.maqId, p.pecId, i.impId) AS manEqpId,
                COALESCE(ma.maqNome, p.pecNome, i.impNome) AS manEqpNome,
            CASE 
                WHEN ma.maqId IS NOT NULL THEN 'Máquina'
                WHEN p.pecId IS NOT NULL THEN 'Peça'
                WHEN i.impId IS NOT NULL THEN 'Implemento'
            END AS maqEqpTipo
            FROM Manutencao_Equipamento m
            LEFT JOIN Peca p ON m.manPecId = p.pecId
            LEFT JOIN Implemento i ON m.manImpId = i.impId
            LEFT JOIN Maquina ma ON m.manMaqId = ma.maqId`;

        const rows = await db.ExecutaComando(sql);
        return rows;
    }

    async gravar() {
        let sql = "";
        let valores = [];
        let result;

        if (this.#manId == 0 || this.#manId == null) {
            sql = `INSERT INTO Manutencao_Equipamento  (manDataInicio, manDataTermino, manDescricao, manPecId, manImpId, manMaqId, manStatus) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
            valores = [
                this.#manDataInicio, 
                this.#manDataTermino, 
                this.#manDescricao, 
                this.#peca, 
                this.#implemento, 
                this.#maquina, 
                this.#manStatus
            ];

            result = await db.ExecutaComandoNonQuery(sql, valores);
            if (result) {
                const lastId = await db.ExecutaComando(`SELECT LAST_INSERT_ID() AS manId`);
                return lastId[0].manId;
            }
        } else {
            sql = `UPDATE Manutencao_Equipamento  SET manDataInicio = ?, manDataTermino = ?, manDescricao = ?, 
                   manPecId = ?, manImpId = ?, manMaqId = ?, manStatus = ? 
                   WHERE manId = ?`;
            valores = [
                this.#manDataInicio, 
                this.#manDataTermino, 
                this.#manDescricao, 
                this.#peca, 
                this.#implemento, 
                this.#maquina, 
                this.#manStatus, 
                this.#manId
            ];

            result = await db.ExecutaComandoNonQuery(sql, valores);
            return result;
        }

        return null;
    }

    async obter(id) {
        const sql = `
            SELECT m.manId, m.manDataInicio, m.manDataTermino, m.manDescricao, m.manStatus,
                COALESCE(ma.maqId, p.pecId, i.impId) AS manEqpId,
                COALESCE(ma.maqNome, p.pecNome, i.impNome) AS manEqpNome,
            CASE 
                WHEN ma.maqId IS NOT NULL THEN 'Máquina'
                WHEN p.pecId IS NOT NULL THEN 'Peça'
                WHEN i.impId IS NOT NULL THEN 'Implemento'
            END AS maqEqpTipo
            FROM Manutencao_Equipamento m
            LEFT JOIN Peca p ON m.manPecId = p.pecId
            LEFT JOIN Implemento i ON m.manImpId = i.impId
            LEFT JOIN Maquina ma ON m.manMaqId = ma.maqId
            WHERE m.manId = ?`;
        
        const valores = [id];
        const rows = await db.ExecutaComando(sql, valores);
        return rows;
    }

    async excluir(idManutencao) {
        const sql = "DELETE FROM Manutencao_Equipamento  WHERE manId = ?";
        const valores = [idManutencao];
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}
