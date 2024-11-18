'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarMaquina({ params: { id } }) {
  const alertMsg = useRef(null);

  const maqNomeRef = useRef(null);
  const maqDataAquisicaoRef = useRef(null);
  const maqTipoRef = useRef(null);
  const maqModeloRef = useRef(null);
  const maqSerieRef = useRef(null);
  const maqAnoFabricacaoRef = useRef(null);
  const maqHorasUsoRef = useRef(null);
  const maqPrecoVendaRef = useRef(null);
  const maqPrecoAluguelDiarioRef = useRef(null);
  const maqPrecoAluguelSemanalRef = useRef(null);
  const maqPrecoAluguelQuinzenalRef = useRef(null);
  const maqPrecoAluguelMensalRef = useRef(null);
  const maqExibirCatalogoRef = useRef(null);
  const [maqDescricao, setMaqDescricao] = useState('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [maquinaAluguelSelecionada, setMaquinaAluguelSelecionada] = useState(null);

  useEffect(() => {
    carregarMaquina();
  }, []);

  const carregarMaquina = () => {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        r.maquina.maqDataAquisicao = new Date(r.maquina.maqDataAquisicao)
        console.log(r)
        setMaquinaSelecionada(r.maquina);
        setMaquinaAluguelSelecionada(r.maquinaAluguel);
        setMaqDescricao(r.maquina.maqDescricao);
      });
  };

  const alterarMaquina = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      maqId: id,
      maqNome: maqNomeRef.current.value,
      maqDataAquisicao: maqDataAquisicaoRef.current.value,
      maqTipo: maqTipoRef.current.value,
      maqModelo: maqModeloRef.current.value,
      maqSerie: maqSerieRef.current.value,
      maqAnoFabricacao: maqAnoFabricacaoRef.current.value,
      maqHorasUso: maqHorasUsoRef.current.value,
      maqPrecoVenda: maqPrecoVendaRef.current.value,
      maqPrecoAluguelDiario: maqPrecoAluguelDiarioRef.current.value,
      maqPrecoAluguelSemanal: maqPrecoAluguelSemanalRef.current.value,
      maqPrecoAluguelQuinzenal: maqPrecoAluguelQuinzenalRef.current.value,
      maqPrecoAluguelMensal: maqPrecoAluguelMensalRef.current.value,
      maqExibirCatalogo: maqExibirCatalogoRef.current.value,
      maqDescricao: maqDescricao
    };

    console.log(dados)

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      var status = null;
      httpClient.put("/maquina", dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            if (status == 200) {
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
    setMaqDescricao(data);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        {maquinaSelecionada && (
          <>
            <section className="input-group">
              <section>
                <label htmlFor="maqNome">Nome da Máquina</label>
                <input
                  type="text"
                  id="maqNome"
                  defaultValue={maquinaSelecionada.maqNome}
                  ref={maqNomeRef}
                />
              </section>

              <section>
                <label htmlFor="maqModelo">Modelo da Máquina</label>
                <input
                  type="text"
                  id="maqModelo"
                  defaultValue={maquinaSelecionada.maqModelo}
                  ref={maqModeloRef}
                />
              </section>

              <section>
                <label htmlFor="maqSerie">Série/Chassi da Máquina</label>
                <input
                  type="text"
                  id="maqSerie"
                  defaultValue={maquinaSelecionada.maqSerie}
                  ref={maqSerieRef}
                />
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqAnoFabricacao">Ano de Fabricação</label>
                <input
                  type="number"
                  id="maqAnoFabricacao"
                  defaultValue={maquinaSelecionada.maqAnoFabricacao}
                  ref={maqAnoFabricacaoRef}
                />
              </section>

              <section>
                <label htmlFor="maqTipo">Tipo da Máquina</label>
                <select
                  id="maqTipo"
                  defaultValue={maquinaSelecionada.maqTipo}
                  ref={maqTipoRef}
                >
                  <option value="Nova">Nova</option>
                  <option value="Semi-Nova">Semi-Nova</option>
                </select>
              </section>

              <section>
                <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
                <input
                  type="date"
                  id="maqDataAquisicao"
                  defaultValue={maquinaSelecionada.maqDataAquisicao}
                  ref={maqDataAquisicaoRef}
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
                  ref={maqPrecoVendaRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqHorasUso">Horas de Uso</label>
                <input
                  type="number"
                  id="maqHorasUso"
                  defaultValue={maquinaSelecionada.maqHorasUso}
                  ref={maqHorasUsoRef}
                />
              </section>

              <section>
                <label htmlFor="maqExibirCatalogo">Exibir nos classificados</label>
                <select
                  id="maqExibirCatalogo"
                  defaultValue={maquinaSelecionada.maqExibirCatalogo}
                  ref={maqExibirCatalogoRef}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqPrecoAluguelDiario">Preço do Aluguel Diário</label>
                <input
                  type="number"
                  id="maqPrecoAluguelDiario"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoDiario}
                  ref={maqPrecoAluguelDiarioRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelSemanal">Preço do Aluguel Semanal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelSemanal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoSemanal}
                  ref={maqPrecoAluguelSemanalRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelQuinzenal">Preço do Aluguel Quinzenal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelQuinzenal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoQuinzenal}
                  ref={maqPrecoAluguelQuinzenalRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelMensal">Preço do Aluguel Mensal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelMensal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoMensal}
                  ref={maqPrecoAluguelMensalRef}
                  step="0.01"
                />
              </section>
            </section>

            <section>
              <label htmlFor="maqDescricao">Descrição da Máquina</label>
              <CustomEditor
                onChange={handleCustomEditorChange}
                initialValue={maqDescricao}
              />
            </section>
          </>
        )}
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={alterarMaquina}>Alterar</button>
      </article>
    </section>
  );
}