'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarImplemento({ params: { id } }) {
  const alertMsg = useRef(null);

  const impNomeRef = useRef(null);
  const impDataAquisicaoRef = useRef(null);
  const equipamentoStatusRef = useRef(null);
  const impInativoRef = useRef(null);

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
        setImpDescricao(r.impDescricao); // Inicializa o valor do editor
      });
  }

  const alterarImplemento = () => {
    const dados = {
      impId: id,
      impNome: impNomeRef.current.value,
      impDataAquisicao: impDataAquisicaoRef.current.value,
      impDescricao: impDescricao,
      impInativo: impInativoRef.current.value,
      equipamentoStatus: equipamentoStatusRef.current.value
    };

    console.log(dados);

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.put(`/implemento`, dados)
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
    setImpDescricao(data); // Atualiza o valor do editor no estado
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
                <label htmlFor="equipamentoStatus">Status do Equipamento</label>
                <select 
                  id="equipamentoStatus" 
                  name="equipamentoStatus" 
                  defaultValue={implementoSelecionado.eqpStaDescricao} // Use a descrição do status
                  ref={equipamentoStatusRef} 
                  required
                >
                  <option value={implementoSelecionado.impStatus}>
                    {implementoSelecionado.eqpStaDescricao} {/* Exibe a descrição do status */}
                  </option>
                </select>
              </section>

              <section>
                <label htmlFor="impInativo">Implemento Inativo</label>
                <select 
                  id="impInativo" 
                  name="impInativo" 
                  defaultValue={implementoSelecionado.impInativo} 
                  ref={impInativoRef} 
                  required
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </section>

              {/* Editor Customizado */}
              <CustomEditor 
                onChange={handleCustomEditorChange} 
                initialValue={impDescricao} // Usa o valor armazenado no estado
              />
            </form>
          </article>
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarImplemento}>Alterar</button>
      </article>
    </section>
  );
}