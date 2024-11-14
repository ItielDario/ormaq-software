'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarMaquina({ params: { id } }) {
  const alertMsg = useRef(null);

  const maquinaNomeRef = useRef(null);
  const maquinaDataAquisicaoRef = useRef(null);
  const maquinaTipoRef = useRef(null);
  const maquinaInativoRef = useRef(null);
  const maquinaHorasUsoRef = useRef(null);
  const maquinaPrecoVendaRef = useRef(null);
  const maquinaPrecoHoraRef = useRef(null);
  const [maquinaDescricao, setMaquinaDescricao] = useState('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  useEffect(() => {
    carregarMaquina();
  }, []);

  function carregarMaquina() {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        r.maqDataAquisicao = new Date(r.maqDataAquisicao).toISOString().split('T')[0];
        setMaquinaSelecionada(r);
        setMaquinaDescricao(r.maqDescricao);
      });
  }

  const alterarMaquina = () => {
    const dados = {
      maqId: id,
      maqNome: maquinaNomeRef.current.value,
      maqDataAquisicao: maquinaDataAquisicaoRef.current.value,
      maqTipo: maquinaTipoRef.current.value,
      maqDescricao: maquinaDescricao,
      maqInativo: maquinaInativoRef.current.value,
      maqHorasUso: maquinaHorasUsoRef.current.value,
      maqPrecoVenda: maquinaPrecoVendaRef.current.value,
      maqPrecoHora: maquinaPrecoHoraRef.current.value,
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
      httpClient.put(`/maquina`, dados)
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
    setMaquinaDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        {maquinaSelecionada && (
          <section>
            <section>
              <label htmlFor="maqNome">Nome da Máquina</label>
              <input
                type="text"
                id="maqNome"
                defaultValue={maquinaSelecionada.maqNome}
                ref={maquinaNomeRef}
              />
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
                <input
                  type="date"
                  id="maqDataAquisicao"
                  defaultValue={maquinaSelecionada.maqDataAquisicao}
                  ref={maquinaDataAquisicaoRef}
                />
              </section>

              <section>
                <label htmlFor="maqTipo">Tipo da Máquina</label>
                <select
                  id="maqTipo"
                  defaultValue={maquinaSelecionada.maqTipo === "Semi-Nova" ? "Semi-Nova" : "Nova"}
                  ref={maquinaTipoRef}
                >
                  <option value="Nova">Nova</option>
                  <option value="Semi-Nova">Semi-Nova</option>
                </select>
              </section>

              <section>
                <label htmlFor="maqHorasUso">Horas de Uso</label>
                <input
                  type="number"
                  id="maqHorasUso"
                  defaultValue={maquinaSelecionada.maqHorasUso}
                  ref={maquinaHorasUsoRef}
                />
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqPrecoVenda">Preço de Venda</label>
                <input
                  type="number"
                  id="maqPrecoVenda"
                  defaultValue={maquinaSelecionada.maqPrecoVenda}
                  ref={maquinaPrecoVendaRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoHora">Preço por Hora</label>
                <input
                  type="number"
                  id="maqPrecoHora"
                  defaultValue={maquinaSelecionada.maqPrecoHora}
                  ref={maquinaPrecoHoraRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqInativo">Exibir nos Classificados</label>
                <select
                  id="maqInativo"
                  defaultValue={maquinaSelecionada.maqInativo}
                  ref={maquinaInativoRef}
                >
                  <option value="0">Sim</option>
                  <option value="1">Não</option>
                </select>
              </section>
            </section>

            <section>
              <label htmlFor="maqDescricao">Descrição da Máquina</label>
              <CustomEditor
                onChange={handleCustomEditorChange}
                initialValue={maquinaDescricao}
              />
            </section>
          </section>
        )}
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarMaquina}>Alterar</button>
      </article>
    </section>
  );
}