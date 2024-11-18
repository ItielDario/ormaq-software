'use client';
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarUsuario({ params: { id } }) {
  const usuNomeRef = useRef(null);
  const usuSenhaRef = useRef(null);
  const usuTelefoneRef = useRef(null);
  const usuEmailRef = useRef(null);
  const alertMsg = useRef(null);

  const [telefone, setTelefone] = useState('');
  const [perfil, setPerfil] = useState({ id: '', descricao: '' });  // Inicializa com o perfil vazio
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  function carregarUsuario() {
    httpClient.get(`/usuario/${id}`)
      .then(r => r.json())
      .then(r => {
        setUsuarioSelecionado(r);
        setTelefone(mascaraTelefone(r.usuTelefone));
        setPerfil({
          id: r.usuPerfil, 
          descricao: r.usuPerDescricao  // Atualiza o perfil com ID e descrição
        });
      });
  }

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setTelefone(mascaraTelefone(valor));
  };

  const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (valor.length <= 10) { // Telefone fixo
      return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else { // Celular
      return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const handlePerfilChange = (e) => {
    const perfilSelecionado = e.target.value === '1' 
      ? { id: 1, descricao: 'Administrador' } 
      : { id: 2, descricao: 'Funcionário' }; 
    setPerfil(perfilSelecionado);
  };

  const alterarUsuario = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    const dados = {
      usuId: id,
      usuNome: usuNomeRef.current.value,
      usuSenha: usuSenhaRef.current.value,
      usuTelefone: telefone || 'Sem Telefone',
      usuEmail: usuEmailRef.current.value || 'Sem Email',
      usuPerfil: perfil.id 
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios!';
      }, 100);
      return;
    }

    httpClient.put(`/usuario`, dados)
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then((response) => {
        setTimeout(() => {
          alertMsg.current.className = status === 201 ? 'alertSuccess' : 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = response.msg;
        }, 100);
      });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Usuário</h1>
      </article>

      <article ref={alertMsg}></article>

      {usuarioSelecionado && (
        <form>
          <section>
            <label htmlFor="usuNome">Nome do Usuário</label>
            <input type="text" id="usuNome" defaultValue={usuarioSelecionado.usuNome} ref={usuNomeRef} />
          </section>

          <section className="input-group">
            <section>
              <label htmlFor="usuSenha">Senha</label>
              <input type="password" id="usuSenha" defaultValue={usuarioSelecionado.usuSenha} ref={usuSenhaRef} />
            </section>

            <section>
              <label htmlFor="usuPerfil">Perfil</label>
              <select id="usuPerfil" value={perfil.id} onChange={handlePerfilChange}>
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
                value={telefone}
                onChange={handleTelefoneChange}
                ref={usuTelefoneRef}
              />
            </section>

            <section>
              <label htmlFor="usuEmail">Email</label>
              <input type="email" id="usuEmail" defaultValue={usuarioSelecionado.usuEmail} ref={usuEmailRef} />
            </section>
          </section>
        </form>
      )}

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/usuario' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarUsuario}>Alterar</button>
      </article>
    </section>
  );
}