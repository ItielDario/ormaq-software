// app/login/page.js
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Validação simples
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    setError(""); // Limpa o erro se os campos estiverem preenchidos

    // Lógica de autenticação aqui
  };

  return (
    <main className="login-container">
      <section className="login-box">
        <h1>Bem-vindo!</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
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

          <button type="submit">Entrar</button>
          <div className="links">
            <a href="/login/cadastrar">Cadastrar</a>
            <a href="/forgot-password">Esqueci a Senha</a>
          </div>
        </form>
      </section>
    </main>
  );
}

