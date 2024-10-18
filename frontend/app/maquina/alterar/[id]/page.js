'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarMaquina({ params: { id } }) {
  const alertMsg = useRef(null);

  const maquinaNomeRef = useRef(null);
  const maquinaDataAquisicaoRef = useRef(null);
  const maquinaTipoRef = useRef(null);
  const equipamentoStatusRef = useRef(null);
  const maquinaInativoRef = useRef(null);
  const maquinaHorasUsoRef = useRef(null);

  const [maquinaDescricao, setMaquinaDescricao] = useState('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  useEffect(() => {
    carregarMaquina();
  }, []);

  function carregarMaquina() {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        console.log(r);
        r.maqDataAquisicao = new Date(r.maqDataAquisicao).toISOString().split('T')[0];
        setMaquinaSelecionada(r);
        setMaquinaDescricao(r.maqDescricao); // Inicializa o valor do editor
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
      equipamentoStatus: equipamentoStatusRef.current.value
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
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
    setMaquinaDescricao(data); // Atualiza o valor do editor no estado
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <article>
        {maquinaSelecionada && (
          <article className="container-forms">
            <form>
              <section>
                <label htmlFor="maqNome">Nome da máquina</label>
                <input 
                  type="text" 
                  id="maqNome" 
                  name="maqNome" 
                  defaultValue={maquinaSelecionada.maqNome} 
                  ref={maquinaNomeRef} 
                  required 
                />
              </section>

              <section>
                <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
                <input 
                  type="date" 
                  id="maqDataAquisicao" 
                  name="maqDataAquisicao" 
                  defaultValue={maquinaSelecionada.maqDataAquisicao} 
                  ref={maquinaDataAquisicaoRef} 
                  required 
                />
              </section>

              <section>
                  <label htmlFor="maqTipo">Tipo da Máquina</label>
                  <select 
                      id="maqTipo" 
                      name="maqTipo" 
                      defaultValue={maquinaSelecionada.maqTipo === "Semi-Nova" ? "1" : "0"} 
                      ref={maquinaTipoRef} 
                      required
                  >
                      <option value="0">Nova</option>
                      <option value="1">Semi-Nova</option>
                  </select>
              </section>


              <section>
                <label htmlFor="equipamentoStatus">Status do Equipamento</label>
                <select 
                  id="equipamentoStatus" 
                  name="equipamentoStatus" 
                  defaultValue={maquinaSelecionada.eqpStaDescricao} // Use a descrição do status
                  ref={equipamentoStatusRef} 
                  required
                >
                  <option value={maquinaSelecionada.maqStatus}>
                    {maquinaSelecionada.eqpStaDescricao} {/* Exibe a descrição do status */}
                  </option>
                </select>
              </section>

              <section>
                <label htmlFor="maqInativo">Máquina Inativa</label>
                <select 
                  id="maqInativo" 
                  name="maqInativo" 
                  defaultValue={maquinaSelecionada.maqInativo} 
                  ref={maquinaInativoRef} 
                  required
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </section>

              <section>
                <label htmlFor="maqHorasUso">Horas de Uso</label>
                <input 
                  type="number" 
                  id="maqHorasUso" 
                  name="maqHorasUso" 
                  defaultValue={maquinaSelecionada.maqHorasUso} 
                  ref={maquinaHorasUsoRef} 
                />
              </section>

              {/* Editor Customizado */}
              <CustomEditor 
                onChange={handleCustomEditorChange} 
                initialValue={maquinaDescricao} // Usa o valor armazenado no estado
              />
            </form>
          </article>
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarMaquina}>Alterar</button>
      </article>
    </section>
  );
}