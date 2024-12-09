// app/login/page.js
"use client";

import { useRef, useContext } from "react";
import httpClient from "../admin/utils/httpClient.js"
import { useRouter } from "next/navigation";
import UserContext from "./../context/userContext.js";

export default function LoginPage() {
  let router = useRouter();
  const usuEmail = useRef(null);
  const usuSenha = useRef(null);
  const alertMsg = useRef(null);

  let { user, setUser } = useContext(UserContext);

  const validarLogin = (e) => {
    e.preventDefault(); // Impede o comportamento padrão de envio do formulário
    alertMsg.current.style.display = 'none';
    let status = 0;

    let dados = {
      usuEmail: usuEmail.current.value,
      usuSenha: usuSenha.current.value
    };

    httpClient.post("/login", dados)
    .then((r) => {
      status = r.status;
      return r.json();
    })
    .then((r) => {
      setTimeout(() => {
        if (status === 200) {
          router.push("/admin/maquina");
          setUser(r.usuario);
          localStorage.setItem("usuario", JSON.stringify(r.usuario));
        } 
        else {
          alertMsg.current.style.display = 'block';
          alertMsg.current.className = "alertError";
          alertMsg.current.innerHTML = r.msg;
        }
      });
    });
  };

  return (
    <main className="login-container">
      <article className="img-logo-login">
        <img src="image/logo-ormaq-preta.png"  alt="Logo ORMAQ preta"/>
      </article>

      <section className="login-box">
        <h1>Bem-vindo!</h1>
        
        <article ref={alertMsg}></article>

        <form onSubmit={validarLogin}>
          <label>E-mail<input type="email" ref={usuEmail} required /></label>
          <label>Senha<input type="password" ref={usuSenha} required /></label>

          <button type="submit">Entrar</button>
          <div className="links">
            <a href="/login/recuperar-senha">Esqueci a Senha</a>
          </div>
        </form>
      </section>
    </main>
  );
}