import Database from "../utils/database.js"

const bd = new Database()

export default class LoginModel{

    #usuId;
    #usuNome;
    #usuSenha;
    #usuEmail;

    get usuId() { return this.#usuId }
    set usuId(usuId) { this.#usuId = usuId }

    get usuEmail() { return this.#usuEmail }
    set usuEmail(usuEmail) { this.#usuEmail = usuEmail }

    get usuNome() { return this.#usuNome }
    set usuNome(usuNome) { this.#usuNome = usuNome }

    get usuSenha() { return this.#usuSenha }
    set usuSenha(usuSenha) { this.#usuSenha = usuSenha }

    constructor(usuEmail, usuSenha, usuNome) {
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuNome = usuNome;
    }

    async autenticar() {
        let sql = "SELECT usuId, usuNome, usuEmail, usuSenha FROM Usuario WHERE usuEmail = ? AND usuSenha = ?";
        let valores = [this.#usuEmail, this.#usuSenha];

        let rows = await bd.ExecutaComando(sql, valores);

        if(rows.length > 0){
            this.usuId = rows[0].usuId
            this.usuNome = rows[0].usuNome
        }
        
        return rows.length > 0;
    }

    async buscarEmail() {
        let sql = "SELECT usuId, usuNome FROM Usuario WHERE usuEmail = ?";
        let valores = [this.#usuEmail];

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

    async atualizarSenha(usuSenhaNova, usuId) {
        const sql = `UPDATE Usuario u SET u.usuSenha = ? WHERE u.usuId = ?`;
        const valores = [usuSenhaNova, usuId];

        let rows = await bd.ExecutaComandoNonQuery(sql, valores);        
        return rows;
    }

    async atualizarDataExpiracao(dataExpiracao, usuId) {
        const sql = `UPDATE RecuperacaoSenha SET recSenDataExpiracao = ? WHERE recSenIdUsuario = ?`;
        const valores = [dataExpiracao, usuId];

        let rows = await bd.ExecutaComandoNonQuery(sql, valores);        
        return rows;
    }

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuSenha": this.#usuSenha
        }
    }
}