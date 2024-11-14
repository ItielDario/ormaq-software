'use client';
import CriarBotao from "../../components/criarBotao.js"; 
import CustomEditor from "../../components/custom-editor.js";
import httpClient from "../../utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarPeca() {
  const pecNomeRef = useRef(null);
  const pecDataAquisicaoRef = useRef(null);
  const pecPrecoVendaRef = useRef(null); 
  const pecPrecoHoraRef = useRef(null); 
  const pecInativoRef = useRef(null);
  const alertMsg = useRef(null);
  const [pecDescricao, setPecDescricao] = useState('');

  const cadastrarPeca = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      pecaNome: pecNomeRef.current.value,
      pecaDataAquisicao: pecDataAquisicaoRef.current.value,
      pecaPrecoVenda: pecPrecoVendaRef.current.value, 
      pecaPrecoHora: pecPrecoHoraRef.current.value,
      pecaInativo: pecInativoRef.current.value,
      pecaDescricao: pecDescricao
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
      
      httpClient.post("/peca/cadastrar", dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if(status == 201){
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              pecNomeRef.current.value = '';
              pecDataAquisicaoRef.current.value = '';
              pecPrecoVendaRef.current.value = '';
              pecPrecoHoraRef.current.value = '';
              pecInativoRef.current.value = '0';
              setPecDescricao('');
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
  }

  const handleCustomEditorChange = (data) => {
    setPecDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section>
          <label htmlFor="pecNomeRef">Nome da Peça</label>
          <input type="text" id="pecNomeRef" ref={pecNomeRef} />
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="pecDataAquisicao">Data de Aquisição</label>
            <input type="date" id="pecDataAquisicao" ref={pecDataAquisicaoRef} />
          </section>

          <section>
            <label htmlFor="pecPrecoVenda">Preço de Venda</label>
            <input type="number" id="pecPrecoVenda" ref={pecPrecoVendaRef} step="0.01" />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="pecPrecoHora">Preço por Hora</label>
            <input type="number" id="pecPrecoHora" ref={pecPrecoHoraRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="pecInativo">Exibir nos classificados</label>
            <select id="pecInativo" ref={pecInativoRef}>
              <option value="0">Sim</option>
              <option value="1">Não</option>
            </select>
          </section>
        </section>

        <section>
          <label htmlFor="pecDescricao">Descrição da Peça</label>
          <CustomEditor
            onChange={handleCustomEditorChange}
            initialValue={pecDescricao}
          />
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarPeca}>Cadastrar</button>
      </article>
    </section>
  );
}