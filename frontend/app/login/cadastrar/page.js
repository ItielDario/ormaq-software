"use client";

import { useRef, useState } from "react";
import httpClient from "@/app/admin/utils/httpClient.js"

export default function RegisterPage() {
  const usuNomeRef = useRef(null);
  const usuSenhaRef = useRef(null);
  const telefoneRef = useRef(null);
  const usuEmailRef = useRef(null);
  const usuPerfilRef = useRef(null);
  const alertMsg = useRef(null);

  const [telefone, setTelefone] = useState("");

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    setTelefone(mascaraTelefone(valor));
  };

  const mascaraTelefone = (valor) => {
    if (valor.length <= 10) {
      return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const cadastrarUsuario = (e) => {
    e.preventDefault();
    alertMsg.current.style.display = "none";
    let status = 0;

    const dados = {
      usuNome: usuNomeRef.current.value,
      usuSenha: usuSenhaRef.current.value,
      usuTelefone: telefone || "Sem Telefone",
      usuEmail: usuEmailRef.current.value || "Sem Email",
      usuPerfil: usuPerfilRef.current.value,
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = "alertError";
        alertMsg.current.style.display = "block";
        alertMsg.current.textContent =
          "Por favor, preencha todos os campos obrigatórios!";
      }, 100);
      return;
    }

    // Supondo que httpClient este  a configurado para fazer as requisições
    httpClient.post("/usuario/cadastrar", dados)
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then((response) => {
        setTimeout(() => {
          if (status === 201) {
            alertMsg.current.className = "alertSuccess";
            limparCampos();
          } else {
            alertMsg.current.className = "alertError";
          }

          alertMsg.current.style.display = "block";
          alertMsg.current.textContent = response.msg;
        }, 100);
      });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(
      (value) => value === "" || value === null || value === undefined
    );
  };

  const limparCampos = () => {
    usuNomeRef.current.value = "";
    usuSenhaRef.current.value = "";
    setTelefone("");
    usuEmailRef.current.value = "";
    usuPerfilRef.current.value = "";
  };

  return (
    <main className="login-container">
      <section className="login-box">
        <h1>Cadastro</h1>
        <p ref={alertMsg} style={{ display: "none" }}></p>

        <form onSubmit={cadastrarUsuario}>

          <label>Nome de Usuário<input type="text" ref={usuNomeRef} required /></label>
          <label>Senha<input type="password" ref={usuSenhaRef} required /></label>

          <section className="input-group">
            <label>Email<input type="email" ref={usuEmailRef} /></label>
            <label>Telefone<input type="text" ref={telefoneRef} value={telefone} onChange={handleTelefoneChange}/></label>
          </section>

          <label>
            Perfil do Usuário
            <select ref={usuPerfilRef} required>
              <option value="">Selecione o perfil</option>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </label>

          <button type="submit">Cadastrar</button>
          <div className="links"><a href="/login">Já tem uma conta? Faça login</a></div>
        </form>
      </section>
    </main>
  );
}