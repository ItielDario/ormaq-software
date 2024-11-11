import Database from "../utils/database.js";

const db = new Database();

export default class UsuarioModel {
    #usuId;
    #usuNome;
    #usuSenha;
    #usuTelefone;
    #usuEmail;
    #usuPerfil;

    get usuId() { return this.#usuId; }
    set usuId(usuId) { this.#usuId = usuId; }

    get usuNome() { return this.#usuNome; }
    set usuNome(usuNome) { this.#usuNome = usuNome; }

    get usuSenha() { return this.#usuSenha; }
    set usuSenha(usuSenha) { this.#usuSenha = usuSenha; }

    get usuTelefone() { return this.#usuTelefone; }
    set usuTelefone(usuTelefone) { this.#usuTelefone = usuTelefone; }

    get usuEmail() { return this.#usuEmail; }
    set usuEmail(usuEmail) { this.#usuEmail = usuEmail; }

    get usuPerfil() { return this.#usuPerfil; }
    set usuPerfil(usuPerfil) { this.#usuPerfil = usuPerfil; }

    constructor(usuId, usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil) {
        this.#usuId = usuId;
        this.#usuNome = usuNome;
        this.#usuSenha = usuSenha;
        this.#usuTelefone = usuTelefone;
        this.#usuEmail = usuEmail;
        this.#usuPerfil = usuPerfil;
    }

    toJSON() {
        return {
            "usuId": this.#usuId,
            "usuNome": this.#usuNome,
            "usuSenha": this.#usuSenha,
            "usuTelefone": this.#usuTelefone,
            "usuEmail": this.#usuEmail,
            "usuPerfil": this.#usuPerfil
        };
    }

    toMAP(rows) {
        const listaUsuarios = [];

        rows.forEach(usuario => {
            listaUsuarios.push(new UsuarioModel(
                usuario["usuId"],
                usuario["usuNome"],
                usuario["usuSenha"],
                usuario["usuTelefone"],
                usuario["usuEmail"],
                usuario["usuPerfil"]
            ));
        });

        return listaUsuarios;
    }

    async listarUsuarios() {
        const sql = `
            SELECT 
                Usuario.usuId, 
                Usuario.usuNome, 
                Usuario.usuSenha, 
                Usuario.usuTelefone, 
                Usuario.usuEmail, 
                Usuario.usuPerfil,
                Usuario_Perfil.usuPerDescricao 
            FROM Usuario
            JOIN Usuario_Perfil ON Usuario.usuPerfil = Usuario_Perfil.usuPerId
            ORDER BY Usuario.usuNome ASC;
        `;
        const rows = await db.ExecutaComando(sql);
        return rows;
    }

    async existeUsuarioPorNome(usuNome) {
        const sql = `SELECT usuId FROM Usuario WHERE usuNome = ?;`;
        const rows = await db.ExecutaComando(sql, [usuNome]);
        return rows.length > 0;
    }

    async gravar() {
        let sql = "";
        let valores = [];

        if (this.#usuId == 0 || this.#usuId == null) {
            // Inserção
            sql = `INSERT INTO Usuario (usuNome, usuSenha, usuTelefone, usuEmail, usuPerfil) VALUES (?, ?, ?, ?, ?);`;
            valores = [this.#usuNome, this.#usuSenha, this.#usuTelefone, this.#usuEmail, this.#usuPerfil];
        } else {
            // Alteração
            sql = `UPDATE Usuario SET usuNome = ?, usuSenha = ?, usuTelefone = ?, usuEmail = ?, usuPerfil = ? WHERE usuId = ?;`;
            valores = [this.#usuNome, this.#usuSenha, this.#usuTelefone, this.#usuEmail, this.#usuPerfil, this.#usuId];
        }

        const result = await db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async obter(id) {
        const sql = `
            SELECT 
                Usuario.usuId, 
                Usuario.usuNome, 
                Usuario.usuSenha, 
                Usuario.usuTelefone, 
                Usuario.usuEmail, 
                Usuario.usuPerfil,
                Usuario_Perfil.usuPerDescricao 
            FROM Usuario
            JOIN Usuario_Perfil ON Usuario.usuPerfil = Usuario_Perfil.usuPerId
            WHERE Usuario.usuId = ?;
        `;
        const valores = [id];
        const rows = await db.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            return rows;
        }
        return null;
    }

    async excluir(id) {
        const sql = `DELETE FROM Usuario WHERE usuId = ?;`;
        const result = await db.ExecutaComandoNonQuery(sql, [id]);
        return result;
    }
}
