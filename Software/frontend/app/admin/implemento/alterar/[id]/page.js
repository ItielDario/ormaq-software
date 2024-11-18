'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarImplemento({ params: { id } }) {
  const alertMsg = useRef(null);

  const impNomeRef = useRef(null);
  const impDataAquisicaoRef = useRef(null);
  const impPrecoVendaRef = useRef(null);
  const impPrecoHoraRef = useRef(null);
  const impExibirCatalogoRef = useRef(null);

  const [impDescricao, setImpDescricao] = useState('');
  const [implementoSelecionado, setImplementoSelecionado] = useState(null);

  useEffect(() => {
    carregarImplemento();
  }, []);

  function carregarImplemento() {
    httpClient.get(`/implemento/${id}`)
      .then(r => r.json())
      .then(r => {
        r.impDataAquisicao = new Date(r.impDataAquisicao).toISOString().split('T')[0];
        setImplementoSelecionado(r);
        setImpDescricao(r.impDescricao);
      });
  }

  const alterarImplemento = () => {
    const dados = {
      impId: id,
      impNome: impNomeRef.current.value,
      impDataAquisicao: impDataAquisicaoRef.current.value,
      impDescricao: impDescricao,
      impPrecoVenda: impPrecoVendaRef.current.value,
      impPrecoHora: impPrecoHoraRef.current.value,
      impExibirCatalogo: impExibirCatalogoRef.current.value,
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
      
      httpClient.put(`/implemento`, dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if (status === 200) {
              alertMsg.current.className = 'alertSuccess';
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
        <h1>Alterar Implemento</h1>
      </article>

      <article ref={alertMsg}></article>

      <article>
        {implementoSelecionado && (
          <article className="container-forms">
            <form>
              <section>
                <label htmlFor="impNome">Nome do Implemento</label>
                <input 
                  type="text" 
                  id="impNome" 
                  name="impNome" 
                  defaultValue={implementoSelecionado.impNome} 
                  ref={impNomeRef} 
                  required 
                />
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="impDataAquisicao">Data de Aquisição</label>
                  <input 
                    type="date" 
                    id="impDataAquisicao" 
                    name="impDataAquisicao" 
                    defaultValue={implementoSelecionado.impDataAquisicao} 
                    ref={impDataAquisicaoRef} 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="impPrecoVenda">Preço de Venda</label>
                  <input 
                    type="number" 
                    id="impPrecoVenda" 
                    name="impPrecoVenda" 
                    defaultValue={implementoSelecionado.impPrecoVenda} 
                    ref={impPrecoVendaRef} 
                    step="0.01" 
                    required 
                  />
                </section>
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="impPrecoHora">Preço por Hora</label>
                  <input 
                    type="number" 
                    id="impPrecoHora" 
                    name="impPrecoHora" 
                    defaultValue={implementoSelecionado.impPrecoHora} 
                    ref={impPrecoHoraRef} 
                    step="0.01" 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="impExibirCatalogo">Exibir nos classificados</label>
                  <select 
                    id="impExibirCatalogo" 
                    name="impExibirCatalogo" 
                    defaultValue={implementoSelecionado.impExibirCatalogo} 
                    ref={impExibirCatalogoRef} 
                    required
                  >
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
          </article>
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarImplemento}>Alterar</button>
      </article>
    </section>
  );
}