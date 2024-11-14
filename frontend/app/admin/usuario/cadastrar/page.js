'use client';
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "../../utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarUsuario() {
  const usuNomeRef = useRef(null);
  const usuSenhaRef = useRef(null);
  const usuTelefoneRef = useRef(null);
  const usuEmailRef = useRef(null);
  const usuPerfilRef = useRef(null);
  const alertMsg = useRef(null);

  const [telefone, setTelefone] = useState('');

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setTelefone(mascaraTelefone(valor));
  };

  const mascaraTelefone = (valor) => {
    if (valor.length <= 10) { // Formato fixo
      return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else { // Formato celular
      return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const cadastrarUsuario = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    const dados = {
      usuNome: usuNomeRef.current.value,
      usuSenha: usuSenhaRef.current.value,
      usuTelefone: telefone || 'Sem Telefone',
      usuEmail: usuEmailRef.current.value || 'Sem Email',
      usuPerfil: usuPerfilRef.current.value
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios!';
      }, 100);
      return;
    }

    httpClient.post("/usuario/cadastrar", dados)
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then((response) => {
        setTimeout(() => {
          if (status == 201) {
            alertMsg.current.className = 'alertSuccess';
            limparCampos();
          } else {
            alertMsg.current.className = 'alertError';
          }

          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = response.msg;
        }, 100);
      });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  const limparCampos = () => {
    usuNomeRef.current.value = '';
    usuSenhaRef.current.value = '';
    setTelefone('');
    usuEmailRef.current.value = '';
    usuPerfilRef.current.value = '';
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Usuário</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
      <section>
            <label htmlFor="usuNome">Nome do Usuário</label>
            <input type="text" id="usuNome" ref={usuNomeRef} />
          </section>
        <section className="input-group">
          

          <section>
            <label htmlFor="usuSenha">Senha</label>
            <input type="password" id="usuSenha" ref={usuSenhaRef} />
          </section>

          <section>
            <label htmlFor="usuPerfil">Perfil</label>
            <select id="usuPerfil" ref={usuPerfilRef}>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="usuTelefone">Telefone</label>
            <input
              type="text"
              id="usuTelefone"
              ref={usuTelefoneRef}
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(XX) XXXXX-XXXX"
            />
          </section>

          <section>
            <label htmlFor="usuEmail">Email</label>
            <input type="email" id="usuEmail" ref={usuEmailRef} />
          </section>
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/usuario' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarUsuario}>Cadastrar</button>
      </article>
    </section>
  );
}