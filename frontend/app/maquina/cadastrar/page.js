'use client';
import CriarBotao from "../../components/criarBotao.js";
import CustomEditor from "../../components/custom-editor.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarMaquina() {
  const maqNomeRef = useRef(null);
  const maqDataAquisicaoRef = useRef(null);
  const maqTipoRef = useRef(null);
  const maqHorasUsoRef = useRef(null);
  const maqPrecoVendaRef = useRef(null); 
  const maqPrecoHoraRef = useRef(null); 
  const maqInativoRef = useRef(null);
  const alertMsg = useRef(null);
  const [maquinaDescricao, setMaquinaDescricao] = useState('');

  const cadastrarMaquina = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      maqNome: maqNomeRef.current.value,
      maqDataAquisicao: maqDataAquisicaoRef.current.value,
      maqTipo: maqTipoRef.current.value,
      maqHorasUso: maqHorasUsoRef.current.value,
      maqPrecoVenda: maqPrecoVendaRef.current.value, 
      maqPrecoHora: maqPrecoHoraRef.current.value,
      maqInativo: maqInativoRef.current.value,
      maqDescricao: maquinaDescricao
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.post("/maquina/cadastrar", dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if(status == 201){
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              maqNomeRef.current.value = '';
              maqDataAquisicaoRef.current.value = '';
              maqTipoRef.current.value = '';
              maqHorasUsoRef.current.value = '';
              maqPrecoVendaRef.current.value = '';
              maqPrecoHoraRef.current.value = '';
              maqInativoRef.current.value = '0';
              <CustomEditor initialValue={''}/>
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
    setMaquinaDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section>
          <label htmlFor="maqNomeRef">Nome da Máquina</label>
          <input type="text" id="maqNomeRef" ref={maqNomeRef} />
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
            <input type="date" id="maqDataAquisicao" ref={maqDataAquisicaoRef} />
          </section>

          <section>
            <label htmlFor="maqTipo">Tipo da Máquina</label>
            <select id="maqTipo" ref={maqTipoRef}>
              <option value="">Selecione</option>
              <option value="Nova">Nova</option>
              <option value="Semi-Nova">Semi-Nova</option>
            </select>
          </section>

          <section>
            <label htmlFor="maqHorasUso">Horas de Uso</label>
            <input type="number" id="maqHorasUso" ref={maqHorasUsoRef} />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="maqPrecoVenda">Preço de Venda</label>
            <input type="number" id="maqPrecoVenda" ref={maqPrecoVendaRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqPrecoHora">Preço por Hora</label>
            <input type="number" id="maqPrecoHora" ref={maqPrecoHoraRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqInativo">Exibir nos classificados</label>
            <select id="maqInativo" ref={maqInativoRef}>
              <option value="0">Sim</option>
              <option value="1">Não</option>
            </select>
          </section>
        </section>

        <section>
          <label htmlFor="maqDescricao">Descrição da Máquina</label>
          <CustomEditor
            onChange={handleCustomEditorChange}
          />
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarMaquina}>Cadastrar</button>
      </article>
    </section>
  );
}