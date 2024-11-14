import Database from "../utils/database.js"

const bd = new Database()

export default class LoginModel{

    #usuNome;
    #usuSenha;

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
        return rows.length > 0;
    }

    toJSON() {
        return {
            "usuNome": this.#usuNome,
            "usuSenha": this.#usuSenha
        }
    }
}