'use client';
import CriarBotao from "../../components/criarBotao.js"; 
import CustomEditor from "../../components/custom-editor.js";
import httpClient from "../../utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarImplemento() {
  const impNomeRef = useRef(null);
  const impDataAquisicaoRef = useRef(null);
  const impPrecoVendaRef = useRef(null); 
  const impPrecoHoraRef = useRef(null); 
  const impInativoRef = useRef(null);
  const alertMsg = useRef(null);
  const [impDescricao, setImpDescricao] = useState('');

  const cadastrarImplemento = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      impNome: impNomeRef.current.value,
      impDataAquisicao: impDataAquisicaoRef.current.value,
      impPrecoVenda: impPrecoVendaRef.current.value, 
      impPrecoHora: impPrecoHoraRef.current.value,
      impInativo: impInativoRef.current.value,
      impDescricao: impDescricao,
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } 
    else {
      var status = null;
      
      httpClient.post("/implemento/cadastrar", dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if(status === 201) {
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              impNomeRef.current.value = '';
              impDataAquisicaoRef.current.value = '';
              impPrecoVendaRef.current.value = '';
              impPrecoHoraRef.current.value = '';
              impInativoRef.current.value = '0';
              setImpDescricao('');
            } else {
              alertMsg.current.className = 'alertError';
            }
            alertMsg.current.style.display = 'block';
            alertMsg.current.textContent = r.msg;
          }, 100);
        });
    }

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  const handleCustomEditorChange = (data) => {
    setImpDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Implemento</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section>
          <label htmlFor="impNomeRef">Nome do Implemento</label>
          <input type="text" id="impNomeRef" ref={impNomeRef} />
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="impDataAquisicao">Data de Aquisição</label>
            <input type="date" id="impDataAquisicao" ref={impDataAquisicaoRef} />
          </section>

          <section>
            <label htmlFor="impPrecoVenda">Preço de Venda</label>
            <input type="number" id="impPrecoVenda" ref={impPrecoVendaRef} step="0.01" />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="impPrecoHora">Preço por Hora</label>
            <input type="number" id="impPrecoHora" ref={impPrecoHoraRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="impInativo">Exibir nos classificados</label>
            <select id="impInativo" ref={impInativoRef}>
              <option value="0">Sim</option>
              <option value="1">Não</option>
            </select>
          </section>
        </section>

        <section>
          <label htmlFor="impDescricao">Descrição do Implemento</label>
          <CustomEditor
            onChange={handleCustomEditorChange}
            initialValue={impDescricao}
          />
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarImplemento}>Cadastrar</button>
      </article>
    </section>
  );
}