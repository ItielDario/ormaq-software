'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarPeca({ params: { id } }) {
  const alertMsg = useRef(null);

  const pecaNomeRef = useRef(null);
  const pecaDataAquisicaoRef = useRef(null);
  const pecaPrecoVendaRef = useRef(null);
  const pecaPrecoHoraRef = useRef(null);
  const pecaInativoRef = useRef(null);

  const [pecaDescricao, setPecaDescricao] = useState('');
  const [pecaSelecionada, setPecaSelecionada] = useState(null);

  useEffect(() => {
    carregarPeca();
  }, []);

  function carregarPeca() {
    httpClient.get(`/peca/${id}`)
      .then(r => r.json())
      .then(r => {
        r.pecDataAquisicao = new Date(r.pecDataAquisicao).toISOString().split('T')[0];
        setPecaSelecionada(r);
        setPecaDescricao(r.pecDescricao);
      });
  }

  const alterarPeca = () => {
    const dados = {
      pecaId: id,
      pecaNome: pecaNomeRef.current.value,
      pecaDataAquisicao: pecaDataAquisicaoRef.current.value,
      pecaDescricao: pecaDescricao,
      pecaPrecoVenda: pecaPrecoVendaRef.current.value,
      pecaPrecoHora: pecaPrecoHoraRef.current.value,
      pecaInativo: pecaInativoRef.current.value,
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
      
      httpClient.put(`/peca`, dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if(status == 201){
              alertMsg.current.className = 'alertSuccess';
            }
            else{
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
    setPecaDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <article>
        {pecaSelecionada && (
          <article className="container-forms">
            <form>
              <section>
                <label htmlFor="pecaNome">Nome da peça</label>
                <input 
                  type="text" 
                  id="pecaNome" 
                  name="pecaNome" 
                  defaultValue={pecaSelecionada.pecNome} 
                  ref={pecaNomeRef} 
                  required 
                />
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="pecaDataAquisicao">Data de Aquisição</label>
                  <input 
                    type="date" 
                    id="pecaDataAquisicao" 
                    name="pecaDataAquisicao" 
                    defaultValue={pecaSelecionada.pecDataAquisicao} 
                    ref={pecaDataAquisicaoRef} 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="pecaPrecoVenda">Preço de Venda</label>
                  <input 
                    type="number" 
                    id="pecaPrecoVenda" 
                    name="pecaPrecoVenda" 
                    defaultValue={pecaSelecionada.pecPrecoVenda} 
                    ref={pecaPrecoVendaRef} 
                    step="0.01" 
                    required 
                  />
                </section>
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="pecaPrecoHora">Preço por Hora</label>
                  <input 
                    type="number" 
                    id="pecaPrecoHora" 
                    name="pecaPrecoHora" 
                    defaultValue={pecaSelecionada.pecPrecoHora} 
                    ref={pecaPrecoHoraRef} 
                    step="0.01" 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="pecaInativo">Exibir nos classificados</label>
                  <select 
                    id="pecaInativo" 
                    name="pecaInativo" 
                    defaultValue={pecaSelecionada.pecInativo} 
                    ref={pecaInativoRef} 
                    required
                  >
                    <option value="0">Sim</option>
                    <option value="1">Não</option>
                  </select>
                </section>
              </section>

              <section>
                <label htmlFor="pecaDescricao">Descrição da Peça</label>
                <CustomEditor 
                  onChange={handleCustomEditorChange} 
                  initialValue={pecaDescricao} 
                />
              </section>
            </form>
          </article>
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarPeca}>Alterar</button>
      </article>
    </section>
  );
}