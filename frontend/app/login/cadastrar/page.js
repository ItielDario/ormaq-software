// app/register/page.js
"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState(""); // Novo campo para o perfil do usuário
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Validação simples
    if (!username || !password || !profile) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setError(""); // Limpa o erro se os campos estiverem preenchidos

    // Lógica de cadastro aqui
  };

  return (
    <main className="login-container">
      <section className="login-box">
        <h1>Cadastro</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <label>
            Nome de Usuário
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Perfil do Usuário
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              required
            >
              <option value="">Selecione o perfil</option>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </label>

          <button type="submit">Cadastrar</button>
          <div className="links">
            <a href="/login">Já tem uma conta? Faça login</a>
          </div>
        </form>
      </section>
    </main>
  );
}