import Database from "../utils/database.js";
import EquipamentoStatusModel from "./equipamentoStatusModel.js";

const db = new Database();

export default class MaquinaModel {
    #maqId;
    #maqNome;
    #maqDataAquisicao;
    #maqTipo;
    #maqModelo;
    #maqSerie;
    #maqAnoFabricacao;
    #maqDescricao;
    #maqExibirCatalogo;
    #maqHorasUso;
    #equipamentoStatus;
    #maqPrecoVenda;

    get maqId() { return this.#maqId; }
    set maqId(maqId) { this.#maqId = maqId; }

    get maqNome() { return this.#maqNome; }
    set maqNome(maqNome) { this.#maqNome = maqNome; }

    get maqDataAquisicao() { return this.#maqDataAquisicao; }
    set maqDataAquisicao(maqDataAquisicao) { this.#maqDataAquisicao = maqDataAquisicao; }

    get maqTipo() { return this.#maqTipo; }
    set maqTipo(maqTipo) { this.#maqTipo = maqTipo; }

    get maqModelo() { return this.#maqModelo; }
    set maqModelo(maqModelo) { this.#maqModelo = maqModelo; }

    get maqSerie() { return this.#maqSerie; }
    set maqSerie(maqSerie) { this.#maqSerie = maqSerie; }

    get maqAnoFabricacao() { return this.#maqAnoFabricacao; }
    set maqAnoFabricacao(maqAnoFabricacao) { this.#maqAnoFabricacao = maqAnoFabricacao; }

    get maqDescricao() { return this.#maqDescricao; }
    set maqDescricao(maqDescricao) { this.#maqDescricao = maqDescricao; }

    get maqExibirCatalogo() { return this.#maqExibirCatalogo; }
    set maqExibirCatalogo(maqExibirCatalogo) { this.#maqExibirCatalogo = maqExibirCatalogo; }

    get maqHorasUso() { return this.#maqHorasUso; }
    set maqHorasUso(maqHorasUso) { this.#maqHorasUso = maqHorasUso; }

    get equipamentoStatus() { return this.#equipamentoStatus; }
    set equipamentoStatus(equipamentoStatus) { this.#equipamentoStatus = equipamentoStatus; }

    get maqPrecoVenda() { return this.#maqPrecoVenda; }
    set maqPrecoVenda(maqPrecoVenda) { this.#maqPrecoVenda = maqPrecoVenda; }

    constructor(maqId, maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, equipamentoStatus, maqPrecoVenda) {
        this.#maqId = maqId;
        this.#maqNome = maqNome;
        this.#maqDataAquisicao = maqDataAquisicao;
        this.#maqTipo = maqTipo;
        this.#maqModelo = maqModelo;
        this.#maqSerie = maqSerie;
        this.#maqAnoFabricacao = maqAnoFabricacao;
        this.#maqDescricao = maqDescricao;
        this.#maqExibirCatalogo = maqExibirCatalogo;
        this.#maqHorasUso = maqHorasUso;
        this.#equipamentoStatus = equipamentoStatus;
        this.#maqPrecoVenda = maqPrecoVenda;
    }

    toJSON() {
        return {
            "maqId": this.#maqId,
            "maqNome": this.#maqNome,
            "maqDataAquisicao": this.#maqDataAquisicao,
            "maqTipo": this.#maqTipo,
            "maqModelo": this.#maqModelo,
            "maqSerie": this.#maqSerie,
            "maqAnoFabricacao": this.#maqAnoFabricacao,
            "maqDescricao": this.#maqDescricao,
            "maqExibirCatalogo": this.#maqExibirCatalogo,
            "maqHorasUso": this.#maqHorasUso,
            "maqPrecoVenda": this.#maqPrecoVenda,
            "equipamentoStatus": this.#equipamentoStatus
        };
    }

    toMAP(rows) {
        const listaMaquinas = [];

        rows.forEach(maquina => {
            const dataAquisicao = new Date(maquina["maqDataAquisicao"]);
            const dataFormatada = dataAquisicao.toISOString().split('T')[0];

            const equipamentoStatus = new EquipamentoStatusModel(
                maquina["equipamentoStatusId"],
                maquina["eqpStaDescricao"]
            );

            listaMaquinas.push(new MaquinaModel(
                maquina["maqId"],
                maquina["maqNome"],
                dataFormatada,
                maquina["maqTipo"],
                maquina["maqModelo"],
                maquina["maqSerie"],
                maquina["maqAnoFabricacao"],
                maquina["maqDescricao"],
                maquina["maqExibirCatalogo"],
                maquina["maqHorasUso"],
                equipamentoStatus,
                maquina["maqPrecoVenda"],
            ));
        });

        return listaMaquinas;
    }

    async listarMaquinas() {
        const sql = `
            SELECT m.maqId, m.maqNome, m.maqDataAquisicao, m.maqTipo, m.maqModelo, m.maqSerie, m.maqAnoFabricacao,
                m.maqDescricao, m.maqExibirCatalogo, m.maqHorasUso, m.maqPrecoVenda,
                es.eqpStaId AS equipamentoStatusId, es.eqpStaDescricao
            FROM Maquina m
            JOIN Equipamento_Status es ON m.maqStatus = es.eqpStaId
            ORDER BY m.maqNome ASC`;

        const rows = await db.ExecutaComando(sql);
        return this.toMAP(rows);
    }

    async gravar() {
        let sql = "";
        let valores = [];
        let result = null;
    
        if (this.#maqId == null || this.#maqId == 0) {
            sql = `INSERT INTO Maquina 
                   (maqNome, maqDataAquisicao, maqTipo, maqModelo, maqSerie, maqAnoFabricacao, maqDescricao, maqExibirCatalogo, maqHorasUso, maqStatus, maqPrecoVenda) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            valores = [
                this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqModelo, this.#maqSerie,
                this.#maqAnoFabricacao, this.#maqDescricao, this.#maqExibirCatalogo, this.#maqHorasUso,
                this.#equipamentoStatus, this.#maqPrecoVenda
            ];
    
            result = await db.ExecutaComandoNonQuery(sql, valores);
    
            // Recuperando o último ID inserido (para MySQL)
            if (result) {
                const maqIdQuery = `SELECT LAST_INSERT_ID() AS maqId`;
                const rows = await db.ExecutaComando(maqIdQuery);
                return rows[0].maqId; // Retorna o ID da máquina recém inserida
            }
        } else {
            sql = `UPDATE Maquina 
                   SET maqNome = ?, maqDataAquisicao = ?, maqTipo = ?, maqModelo = ?, maqSerie = ?, maqAnoFabricacao = ?, 
                       maqDescricao = ?, maqExibirCatalogo = ?, maqHorasUso = ?, maqStatus = ?, maqPrecoVenda = ?
                   WHERE maqId = ?`;
            valores = [
                this.#maqNome, this.#maqDataAquisicao, this.#maqTipo, this.#maqModelo, this.#maqSerie,
                this.#maqAnoFabricacao, this.#maqDescricao, this.#maqExibirCatalogo, this.#maqHorasUso,
                this.#equipamentoStatus, this.#maqPrecoVenda, this.#maqId
            ];
    
            result = await db.ExecutaComandoNonQuery(sql, valores);
        }
    
        return result;
    }    

    async obter(id) {
        let sql = `
            SELECT 
                Maquina.maqId, 
                Maquina.maqNome, 
                Maquina.maqDataAquisicao, 
                Maquina.maqTipo, 
                Maquina.maqModelo,         
                Maquina.maqSerie,           
                Maquina.maqAnoFabricacao,   
                Maquina.maqDescricao, 
                Maquina.maqExibirCatalogo,  
                Maquina.maqHorasUso, 
                Maquina.maqPrecoVenda, 
                Equipamento_Status.eqpStaId,
                Equipamento_Status.eqpStaDescricao
            FROM Maquina 
            INNER JOIN Equipamento_Status
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

    async isManutancao(idMaquina) {
        let sql = `SELECT Maquina.maqId, Maquina.maqNome
                    FROM Maquina
                    WHERE Maquina.maqStatus = 3
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

    async listarMaquinasDisponiveis(idMaquina) {
        let sql = `
            SELECT 
                Maquina.maqId, 
                Maquina.maqNome, 
                Maquina.maqDataAquisicao, 
                Maquina.maqTipo, 
                Maquina.maqModelo,         
                Maquina.maqSerie,           
                Maquina.maqAnoFabricacao,   
                Maquina.maqDescricao, 
                Maquina.maqExibirCatalogo,  
                Maquina.maqHorasUso, 
                Maquina.maqPrecoVenda,
                Maquina_Aluguel.maqAluPrecoDiario,
                Maquina_Aluguel.maqAluPrecoSemanal,
                Maquina_Aluguel.maqAluPrecoQuinzenal,
                Maquina_Aluguel.maqAluPrecoMensal
            FROM Maquina
            LEFT JOIN Maquina_Aluguel 
            ON Maquina.maqId = Maquina_Aluguel.maqId
            WHERE Maquina.maqStatus = 1;`;
    
        let valores = [idMaquina];
        let rows = await db.ExecutaComando(sql, valores);
    
        return rows;
    }

    async listarMaquinasDaLocacao(idLocacao) {
        let sql = `
            SELECT 
                L.locId,
                IL.iteLocId,
                M.maqId, 
                M.maqNome, 
                M.maqDataAquisicao, 
                M.maqTipo, 
                M.maqModelo,         
                M.maqSerie,           
                M.maqAnoFabricacao,   
                M.maqDescricao, 
                M.maqExibirCatalogo,  
                M.maqHorasUso, 
                M.maqPrecoVenda,
                MA.maqAluPrecoDiario,
                MA.maqAluPrecoSemanal,
                MA.maqAluPrecoQuinzenal,
                MA.maqAluPrecoMensal
            FROM Locacao L
            JOIN Itens_Locacao IL ON IL.IteLocLocacaoId = L.locId
            JOIN Maquina M ON M.maqId = IL.iteLocMaqId
            JOIN Maquina_Aluguel MA ON MA.maqId = M.maqId
            WHERE L.locId = ?`;
    
        let valores = [idLocacao];
        let rows = await db.ExecutaComando(sql, valores);
    
        return rows;
    }   
}