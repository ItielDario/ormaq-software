// app/login/page.js
"use client";

import { useRef } from "react";

export default function LoginPage() {
  const usuNome = useRef(null);
  const usuSenha = useRef(null);
  const alertMsg = useRef(null);

  const validarLogin = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    if(usuNome.current.value != "" && usuSenha.current.value != ""){
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Preencha os dados corretamente!';
      }, 100);
      return;
    };

    let dados = {
      usuNome: usuNome.current.value,
      usuSenha: usuSenha.current.value
    }

    console.log(dados)

    // httpClient.post("/login", dados)
    // .then((r) => {
    //   status = r.status;
    //   return r.json();
    // })
    // .then((response) => {
    //   setTimeout(() => {
    //     if (status == 201) {
    //       router.push("/admin");
    //       setUser(resposta.usuario);
    //       localStorage.setItem("usuario", JSON.stringify(resposta.usuario));
    //     }
    //     else{
    //       alertMsg.current.className = "msgError";
    //       alertMsg.current.innerHTML = resposta.msg;
    //     }
    //   })
    // })
  };

  return (
    <main className="login-container">
      <section className="login-box">
        <h1>Bem-vindo!</h1>
        
        <article ref={alertMsg}></article>

        <form>
          <label>Nome de Usuário<input type="text" ref={usuNome}  required/></label>
          <label>Senha<input type="password" ref={usuSenha} required/></label>

          <button onClick={validarLogin}>Entrar</button>
          <div className="links">
            <a href="/login/cadastrar">Cadastrar</a>
            <a href="/forgot-password">Esqueci a Senha</a>
          </div>
        </form>
      </section>
    </main>
  );
}

