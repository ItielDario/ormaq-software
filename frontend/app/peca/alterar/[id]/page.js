'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarPeca({ params: { id } }) {
  const alertMsg = useRef(null);

  const pecaNomeRef = useRef(null);
  const pecaDataAquisicaoRef = useRef(null);
  const equipamentoStatusRef = useRef(null);
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
        setPecaDescricao(r.pecDescricao); // Inicializa o valor do editor
      });
  }

  const alterarPeca = () => {
    const dados = {
      pecaId: id,
      pecaNome: pecaNomeRef.current.value,
      pecaDataAquisicao: pecaDataAquisicaoRef.current.value,
      pecaDescricao: pecaDescricao,
      pecaInativo: pecaInativoRef.current.value,
      equipamentoStatus: equipamentoStatusRef.current.value
    };

    console.log(dados)

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.put(`/peca`, dados)
      .then((r) => { 
        status = r.status;
        return r.json()}
      )
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
    setPecaDescricao(data); // Atualiza o valor do editor no estado
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
                <label htmlFor="equipamentoStatus">Status do Equipamento</label>
                <select 
                  id="equipamentoStatus" 
                  name="equipamentoStatus" 
                  defaultValue={pecaSelecionada.eqpStaDescricao} // Use a descrição do status
                  ref={equipamentoStatusRef} 
                  required
                >
                  <option value={pecaSelecionada.pecStatus}>
                    {pecaSelecionada.eqpStaDescricao} {/* Exibe a descrição do status */}
                  </option>
                </select>
              </section>


              <section>
                <label htmlFor="pecaInativo">Peça Inativa</label>
                <select 
                  id="pecaInativo" 
                  name="pecaInativo" 
                  defaultValue={pecaSelecionada.pecInativo} 
                  ref={pecaInativoRef} 
                  required
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </section>

              {/* Editor Customizado */}
              <CustomEditor 
                onChange={handleCustomEditorChange} 
                initialValue={pecaDescricao} // Usa o valor armazenado no estado
              />
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
