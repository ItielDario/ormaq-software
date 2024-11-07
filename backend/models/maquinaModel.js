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
    #maqPrecoVenda;
    #maqPrecoHora;

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

    get maqPrecoVenda() { return this.#maqPrecoVenda; }
    set maqPrecoVenda(maqPrecoVenda) { this.#maqPrecoVenda = maqPrecoVenda; }

    get maqPrecoHora() { return this.#maqPrecoHora; }
    set maqPrecoHora(maqPrecoHora) { this.#maqPrecoHora = maqPrecoHora; }

    constructor(maqId, maqNome, maqDataAquisicao, maqTipo, maqDescricao, maqInativo, maqHorasUso, equipamentoStatus, maqPrecoVenda, maqPrecoHora) {
        this.#maqId = maqId;
        this.#maqNome = maqNome;
        this.#maqDataAquisicao = maqDataAquisicao;
        this.#maqTipo = maqTipo;
        this.#maqDescricao = maqDescricao;
        this.#maqInativo = maqInativo;
        this.#maqHorasUso = maqHorasUso;
        this.#equipamentoStatus = equipamentoStatus;
        this.#maqPrecoVenda = maqPrecoVenda;  // Atributo novo para preço de venda
        this.#maqPrecoHora = maqPrecoHora;    // Atributo novo para preço por hora
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
            "maqPrecoVenda": this.#maqPrecoVenda,     // Incluindo o preço de venda no JSON
            "maqPrecoHora": this.#maqPrecoHora,       // Incluindo o preço por hora no JSON
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
                maquina["maqDescricao"],        // Descrição da máquina
                maquina["maqInativo"],          // Se a máquina está inativa
                maquina["maqHorasUso"],         // Horas de uso
                equipamentoStatus,              // Status do equipamento como objeto
                maquina["maqPrecoVenda"],       // Preço de venda
                maquina["maqPrecoHora"]         // Preço por hora
            ));
        });
        return listaMaquinas;
    }

    async listarMaquinas() {
        const sql = `
            SELECT m.maqId, m.maqNome, m.maqDataAquisicao, m.maqTipo, m.maqDescricao, m.maqInativo, m.maqHorasUso, m.maqPrecoVenda, m.maqPrecoHora, es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Maquina m
            JOIN Equipamento_Status es ON m.maqStatus = es.eqpStaId;`;

        const rows = await db.ExecutaComando(sql);
        const listaMaquinas = this.toMAP(rows);

        return listaMaquinas;
    }

    async gravar() {
        let sql = "";
        let valores = [];
        
        if (this.#maqId == 0 || this.#maqId == null) {
            // Inserção
            sql = `INSERT INTO Maquina (maqNome, maqDataAquisicao, maqTipo, maqDescricao, maqInativo, maqStatus, maqHorasUso, maqPrecoVenda, maqPrecoHora) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            valores = [this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqDescricao, this.#maqInativo, this.#equipamentoStatus, this.#maqHorasUso, this.#maqPrecoVenda, this.#maqPrecoHora];
        } else {
            // Alteração
            sql = `UPDATE maquina SET maqNome = ?, maqDataAquisicao = ?, maqTipo = ?, maqDescricao = ?, maqHorasUso = ?, maqPrecoVenda = ?, maqPrecoHora = ? WHERE maqId = ?`;
            valores = [this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqDescricao, this.#maqHorasUso, this.#maqPrecoVenda, this.#maqPrecoHora, this.#maqId];
        }

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        let sql = `SELECT Maquina.maqId, Maquina.maqNome, Maquina.maqDataAquisicao, Maquina.maqTipo, Maquina.maqDescricao, Maquina.maqInativo, Maquina.maqHorasUso, Maquina.maqPrecoVenda, Maquina.maqPrecoHora, Equipamento_Status.eqpStaDescricao
                    FROM Maquina INNER JOIN Equipamento_Status
                    ON Maquina.maqStatus = Equipamento_Status.eqpStaId
                    WHERE Maquina.maqId = ?`;
        let valores = [id];

        let rows = await db.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            return rows[0];
        }
        return null;
    }

    async isLocado(idMaquina) {
        let sql = `SELECT Maquina.maqId, Maquina.maqNome
                    FROM Maquina
                    WHERE Maquina.maqStatus = 2
                    AND Maquina.maqId = ?`;
        let valores = [idMaquina]

        let rows = await db.ExecutaComando(sql, valores);
        return rows.length > 0;
    }

    async excluir(idMaquina) {
        let sql = "DELETE FROM Maquina WHERE maqId = ?";
        let valores = [idMaquina];

        let result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async atualizarHorasUso(maqId, maqHoras) {
        const sql = `UPDATE Maquina SET maqHorasUso = ? WHERE maqId = ?`;
        const valores = [maqHoras, maqId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async atualizarStatus(maqId, status) {
        const sql = `UPDATE Maquina SET maqStatus = ? WHERE maqId = ?;`;
        const valores = [status, maqId];
        
        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}