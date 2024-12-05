"use client";

import { useRef, useState } from "react";
import httpClient from "../../admin/utils/httpClient.js";

export default function RecuperarSenhaPage() {
  const [step, setStep] = useState(1); // Etapa do formulário
  const [username, setUsername] = useState("");
  const [usuId, setUsuId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const alertMsg = useRef(null);

  const handleUsuarioSubmit = (e) => {
    e.preventDefault();
    alertMsg.current.style.display = "none";
    let status = 0;

    httpClient.post("/login/buscar", { username })
    .then((r) => {
      status = r.status;
      return r.json();
    })
    .then((r) => {
      if (status === 200) {
        console.log(r)
        console.log(r.usuId)
        setUsuId(r.usuId)
        setStep(2);
      } 
      else {
        alertMsg.current.style.display = "block";
        alertMsg.current.className = "alertError";
        alertMsg.current.innerHTML = r.msg;
      }
    });
  };

  const handleCodigoSubmit = (e) => {
    e.preventDefault();
    alertMsg.current.style.display = "none";
    let status = 0;

    httpClient.post("/login/validar-codigo", { usuId, codigo })
    .then((r) => {
      status = r.status;
      return r.json();
    })
    .then((r) => {
      if (status === 200) {
        setStep(3);
      } else {
        alertMsg.current.style.display = "block";
        alertMsg.current.className = "alertError";
        alertMsg.current.innerHTML = r.msg;
      }
    });
  };

  const handleSenhaSubmit = (e) => {
    e.preventDefault();
    alertMsg.current.style.display = "none";

    if (novaSenha !== confirmarSenha) {
      alertMsg.current.style.display = "block";
      alertMsg.current.className = "alertError";
      alertMsg.current.innerHTML = "As senhas não coincidem.";
      return;
    }

    let status = 0;
    httpClient.post("/recuperar-senha/nova-senha", { username, novaSenha })
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then((r) => {
        if (status === 200) {
          alertMsg.current.style.display = "block";
          alertMsg.current.className = "alertSuccess";
          alertMsg.current.innerHTML = "Senha alterada com sucesso!";
          setTimeout(() => window.location.href = "/login", 2000);
        } else {
          alertMsg.current.style.display = "block";
          alertMsg.current.className = "alertError";
          alertMsg.current.innerHTML = r.msg;
        }
      });
  };

  return (
    <main className="login-container">
      <section className="login-box">
        <h1>Recuperar Senha</h1>

        <article ref={alertMsg}></article>

        {step === 1 && (
          <form onSubmit={handleUsuarioSubmit}>
            <label>Nome de Usuário
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Digite seu nome de usuário"
                style={{marginTop: '0.5vw'}}
              />
            </label>
            <button style={{marginTop: '1vw'}} type="submit">Enviar</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodigoSubmit}>
            <label>Código de Verificação
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                placeholder="Digite o código enviado ao seu e-mail"
                style={{marginTop: '0.5vw'}}
              />
            </label>
            <button style={{marginTop: '1vw'}} type="submit">Validar Código</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSenhaSubmit}>
            <label>Nova Senha
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                placeholder="Digite sua nova senha"
                style={{marginTop: '0.5vw'}}
              />
            </label>
            <label>Confirmar Senha
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                placeholder="Confirme sua nova senha"
                style={{marginTop: '0.5vw'}}
              />
            </label>
            <button style={{marginTop: '1vw'}} type="submit">Salvar Nova Senha</button>
          </form>
        )}

        <div style={{marginTop: '2vw'}} className="links">
          <a href="/login">Fazer login</a>
        </div>
      </section>
    </main>
  );
}