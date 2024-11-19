'use client';
import { ColorSelectorView } from "ckeditor5";
import CriarBotao from "../../components/criarBotao.js";
import CustomEditor from "../../components/custom-editor.js";
import httpClient from "../../utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarMaquina() {
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
  const alertMsg = useRef(null);
  const [maquinaDescricao, setMaquinaDescricao] = useState('');

  const cadastrarMaquina = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
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
      maqDescricao: maquinaDescricao
    };

    console.log(dados)

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } 
    else {
      var status = null;
      
      httpClient.post("/maquina/cadastrar", dados)
        .then((r) => {
          status = r.status;
          return r.json();
        })
        .then(r => {
          setTimeout(() => {
            console.log(r)
            if(status == 201){
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              maqNomeRef.current.value = '';
              maqDataAquisicaoRef.current.value = '';
              maqTipoRef.current.value = '';
              maqModeloRef.current.value = ''; 
              maqSerieRef.current.value = ''; 
              maqAnoFabricacaoRef.current.value = ''; 
              maqHorasUsoRef.current.value = '';
              maqPrecoVendaRef.current.value = '';
              maqPrecoAluguelDiarioRef.current.value = ''; 
              maqPrecoAluguelSemanalRef.current.value = ''; 
              maqPrecoAluguelQuinzenalRef.current.value = ''; 
              maqPrecoAluguelMensalRef.current.value = ''; 
              maqExibirCatalogoRef.current.value = '0';
              <CustomEditor initialValue={''}/>;
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
        <section className="input-group">
          <section>
            <label htmlFor="maqNomeRef">Nome da Máquina</label>
            <input type="text" id="maqNomeRef" ref={maqNomeRef} />
          </section>

          <section>
            <label htmlFor="maqModelo">Modelo da Máquina</label>
            <input type="text" id="maqModelo" ref={maqModeloRef} />
          </section>

          <section>
            <label htmlFor="maqSerie">Série/Chassi da Máquina</label>
            <input type="text" id="maqSerie" ref={maqSerieRef} />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="maqAnoFabricacao">Ano de Fabricação</label>
            <input type="number" id="maqAnoFabricacao" ref={maqAnoFabricacaoRef} />
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
            <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
            <input type="date" id="maqDataAquisicao" ref={maqDataAquisicaoRef} />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="maqPrecoAluguelQuinzenal">Preço de Venda</label>
            <input type="number" id="maqPrecoVendaRef" ref={maqPrecoVendaRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqHorasUso">Horas de Uso</label>
            <input type="number" id="maqHorasUso" ref={maqHorasUsoRef} />
          </section>

          <section>
            <label htmlFor="maqExibirCatalogo">Exibir nos classificados</label>
            <select id="maqExibirCatalogo" ref={maqExibirCatalogoRef}>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </select>
          </section>
        </section>


        <section className="input-group">
          <section>
            <label htmlFor="maqPrecoAluguelDiario">Preço do Aluguel Diário</label>
            <input type="number" id="maqPrecoAluguelDiario" ref={maqPrecoAluguelDiarioRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqPrecoAluguelSemanal">Preço do Aluguel Semanal</label>
            <input type="number" id="maqPrecoAluguelSemanal" ref={maqPrecoAluguelSemanalRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqPrecoAluguelQuinzenal">Preço do Aluguel Quinzenal</label>
            <input type="number" id="maqPrecoAluguelQuinzenal" ref={maqPrecoAluguelQuinzenalRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="maqPrecoAluguelMensal">Preço do Aluguel Mensal</label>
            <input type="number" id="maqPrecoAluguelMensal" ref={maqPrecoAluguelMensalRef} step="0.01" />
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
        <CriarBotao value='Voltar' href='/admin/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarMaquina}>Cadastrar</button>
      </article>
    </section>
  );
}