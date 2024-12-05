import Database from "../utils/database.js"

const bd = new Database()

export default class LoginModel{

    #usuId;
    #usuNome;
    #usuSenha;

    get usuId() { return this.#usuId }
    set usuId(usuId) { this.#usuId = usuId }

    get usuNome() { return this.#usuNome }
    set usuNome(usuNome) { this.#usuNome = usuNome }

    get usuSenha() { return this.#usuSenha }
    set usuSenha(usuSenha) { this.#usuSenha = usuSenha }

    constructor(usuNome, usuSenha) {
        this.#usuNome = usuNome;
        this.#usuSenha = usuSenha;
    }

    async autenticar() {
        let sql = "SELECT usuId, usuNome, usuEmail, usuSenha FROM Usuario WHERE usuNome = ? AND usuSenha = ?";
        let valores = [this.#usuNome, this.#usuSenha];

        let rows = await bd.ExecutaComando(sql, valores);

        if(rows.length > 0){
            this.usuId = rows[0].usuId
        }
        
        return rows.length > 0;
    }

    async buscarEmail() {
        let sql = "SELECT usuId, usuEmail FROM Usuario WHERE usuNome = ?";
        let valores = [this.#usuNome];

        let rows = await bd.ExecutaComando(sql, valores); 
        return rows[0];
    }

    async gravarRecuperacaoSenha(usuId, codigo, dataAtual) {
        const sql = `INSERT INTO RecuperacaoSenha (recSenIdUsuario, recSenCodigo, recSenDataPedidoRecuperacao, recSenDataExpiracao) VALUES (?, ?, ?, ?)`;
        const valores = [usuId, codigo, dataAtual, null];

        let rows = await bd.ExecutaComandoNonQuery(sql, valores);        
        return rows;
    }

    async validarCodigo(usuId) {
        let sql = `SELECT * 
                    FROM RecuperacaoSenha
                    WHERE recSenIdUsuario = ?  
                    ORDER BY recSenDataPedidoRecuperacao DESC
                    LIMIT 1;
                    `;
        let valores = [usuId];

        let rows = await bd.ExecutaComando(sql, valores); 
        return rows[0];
    }

    async buscarEmail() {
        let sql = "SELECT usuId, usuEmail FROM Usuario WHERE usuNome = ?";
        let valores = [this.#usuNome];

        let rows = await bd.ExecutaComando(sql, valores); 
        return rows[0];
    }

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuSenha": this.#usuSenha
        }
    }
}