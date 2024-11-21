import Database from "../utils/database.js";

const db = new Database();

export default class ImagensEquipamentoModel {
    #imgId;
    #imgUrl;
    #imgNome;
    #imgPrincipal;
    #imgPecId;
    #imgMaqId;
    #imgImpId;

    get imgId() { return this.#imgId; }
    set imgId(imgId) { this.#imgId = imgId; }

    get imgUrl() { return this.#imgUrl; }
    set imgUrl(imgUrl) { this.#imgUrl = imgUrl; }

    get imgNome() { return this.#imgNome; }
    set imgNome(imgNome) { this.#imgNome = imgNome; }

    get imgPrincipal() { return this.#imgPrincipal; }
    set imgPrincipal(imgPrincipal) { this.#imgPrincipal = imgPrincipal; }

    get imgPecId() { return this.#imgPecId; }
    set imgPecId(imgPecId) { this.#imgPecId = imgPecId; }

    get imgMaqId() { return this.#imgMaqId; }
    set imgMaqId(imgMaqId) { this.#imgMaqId = imgMaqId; }

    get imgImpId() { return this.#imgImpId; }
    set imgImpId(imgImpId) { this.#imgImpId = imgImpId; }

    constructor(imgId, imgUrl, imgNome, imgPrincipal, imgPecId, imgMaqId, imgImpId) {
        this.#imgId = imgId;
        this.#imgUrl = imgUrl;
        this.#imgNome = imgNome;
        this.#imgPrincipal = imgPrincipal;
        this.#imgPecId = imgPecId;
        this.#imgMaqId = imgMaqId;
        this.#imgImpId = imgImpId;
    }

    toJSON() {
        return {
            imgId: this.#imgId,
            imgUrl: this.#imgUrl,
            imgPrincipal: this.#imgPrincipal,
            imgPecId: this.#imgPecId,
            imgMaqId: this.#imgMaqId,
            imgImpId: this.#imgImpId
        };
    }

    toMAP(rows) {
        return rows.map(item => new ImagensEquipamentoModel(
            item["imgId"],
            item["imgUrl"],
            item["imgPrincipal"],
            item["imgPecId"],
            item["imgMaqId"],
            item["imgImpId"]
        ));
    }

    async gravar() {
        const sql = `
            INSERT INTO Imagens_Equipamento (imgUrl, imgPrincipal, imgNome, imgPecId, imgMaqId, imgImpId)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#imgUrl,
            this.#imgPrincipal,
            this.#imgNome,
            this.#imgPecId,
            this.#imgMaqId,
            this.#imgImpId
        ];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async atualizarImgPrincipal(is, imgId) {
        const sql = `UPDATE Imagens_Equipamento SET imgPrincipal = ? WHERE imgId = ?;`;
        const valores = [is, imgId];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluir(id) {
        const sql = "DELETE FROM Imagens_Equipamento WHERE imgId = ?";
        const valores = [id];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirImgMaquina(id) {
        const sql = "DELETE FROM Imagens_Equipamento WHERE imgMaqId = ?";
        const valores = [id];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirImgPeca(id) {
        const sql = "DELETE FROM Imagens_Equipamento WHERE imgPecId = ?";
        const valores = [id];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async excluirImgImplemento(id) {
        const sql = "DELETE FROM Imagens_Equipamento WHERE imgImpId = ?";
        const valores = [id];

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obterImgMaquina(id) {
        const sql = `
            SELECT Imagens_Equipamento.imgId, Imagens_Equipamento.imgUrl, Imagens_Equipamento.imgNome, Imagens_Equipamento.imgPrincipal
            FROM Imagens_Equipamento
            WHERE Imagens_Equipamento.imgMaqId = ?
            ORDER BY Imagens_Equipamento.imgPrincipal DESC`;
        const valores = [id];

        const rows = await db.ExecutaComando(sql, valores);
        return rows;
    }

    async obterImgPeca(id) {
         const sql = `
            SELECT Imagens_Equipamento.imgId, Imagens_Equipamento.imgUrl, Imagens_Equipamento.imgNome, Imagens_Equipamento.imgPrincipal
            FROM Imagens_Equipamento
            WHERE Imagens_Equipamento.imgPecId = ?
            ORDER BY Imagens_Equipamento.imgPrincipal DESC`;
        const valores = [id];
        
        const rows = await db.ExecutaComando(sql, valores);
        return rows;
    }

    async obterImgImplemento(id) {
        const sql = `
        SELECT Imagens_Equipamento.imgId, Imagens_Equipamento.imgUrl, Imagens_Equipamento.imgNome, Imagens_Equipamento.imgPrincipal
        FROM Imagens_Equipamento
        WHERE Imagens_Equipamento.imgImpId = ?
        ORDER BY Imagens_Equipamento.imgPrincipal DESC`;
        const valores = [id];
    
        const rows = await db.ExecutaComando(sql, valores);
        return rows;
    }
}