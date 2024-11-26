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
        let sql = "SELECT usuId, usuNome, usuEmail, usuSenha FROM usuario WHERE usuNome = ? AND usuSenha = ?";
        let valores = [this.#usuNome, this.#usuSenha];

        let rows = await bd.ExecutaComando(sql, valores);

        if(rows.length > 0){
            this.usuId = rows[0].usuId
        }
        
        return rows.length > 0;
    }

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuSenha": this.#usuSenha
        }
    }
}