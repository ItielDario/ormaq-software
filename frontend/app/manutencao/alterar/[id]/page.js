'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function AlterarManutencao({ params: { id } }) {
  const dataInicioRef = useRef(null);
  const descricaoRef = useRef(null);
  const tipoEquipamentoRef = useRef(null);
  const equipamentoIdRef = useRef(null);

  const [maquinas, setMaquinas] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [implementos, setImplementos] = useState([]);
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState({});
  const alertMsg = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    httpClient.get("/maquina/obter/disponivel").then(r => r.json()).then(r => setMaquinas(r));
    httpClient.get("/peca/obter/disponivel").then(r => r.json()).then(r => setPecas(r));
    httpClient.get("/implemento/obter/disponivel").then(r => r.json()).then(r => setImplementos(r));

    httpClient.get(`/manutencao/${id}`)
      .then(r => r.json())
      .then(data => {
        // Validação do tipo de equipamento e criação do objeto correspondente
        let novoEquipamento;

        // SE FEZ NECESSÁRIO POIS AO ENTRAR NESSA PÁGINA O USEEFFECT SELECIONA APENAS AS MÁQUINAS, PEÇA E IMPLEMENTOS COM STATUS 'DISPONIVEL' E O EQUIPAMENTO SELECIONADO PARA SER ALTERADO ESTÁ COM O STUATUS 'EM MANUTENÇÃO' E POR TANTO NÃO APARECERIA NA LISTA DE NOMES DOS EQUIPAMENTOS
        if (data.maqEqpTipo === 'Máquina') {
          novoEquipamento = {
            maqId: data.manEqpId,
            maqNome: data.manEqpNome,
            maqPrecoHora: data.maqPrecoHora || null,
            maqTipo: data.maqEqpTipo
          };
          setMaquinas(prevMaquinas => [...prevMaquinas, novoEquipamento]);
          
        } else if (data.maqEqpTipo === 'Peça') {
          novoEquipamento = {
            pecId: data.manEqpId,
            pecNome: data.manEqpNome,
            pecPrecoHora: data.maqPrecoHora || null,
            pecTipo: data.maqEqpTipo
          };
          setPecas(prevPecas => [...prevPecas, novoEquipamento]);
          
        } else if (data.maqEqpTipo === 'Implemento') {
          novoEquipamento = {
            impId: data.manEqpId,
            impNome: data.manEqpNome,
            impPrecoHora: data.maqPrecoHora || null,
            impTipo: data.maqEqpTipo
          };
          setImplementos(prevImplementos => [...prevImplementos, novoEquipamento]);
        }

        setManutencaoSelecionada(data);
        setTipoEquipamento(data.maqEqpTipo);

        dataInicioRef.current.value = new Date(data.manDataInicio).toISOString().split('T')[0];
        descricaoRef.current.value = data.manDescricao;
      });
  }, [id]);


  const verificaTipoEquipamento = () => {
    const listaEquipamentos = {
      'Máquina': maquinas,
      'Peça': pecas,
      'Implemento': implementos,
    };

    const equipamentos = listaEquipamentos[tipoEquipamento] || [];

    return (
      <datalist id="equipamentos">
        {equipamentos.map(equipamento => (
          <option
            key={equipamento[Object.keys(equipamento)[0]]} // Usa o primeiro valor como chave
            value={equipamento[Object.keys(equipamento)[1]]} // Usa o segundo valor como nome
          />
        ))}
      </datalist>
    );
  };

  const alterarManutencao = () => {
    alertMsg.current.style.display = 'none';
    let equipamentoSelecionado = 'nulo';

    if (tipoEquipamento === 'Máquina') {
      equipamentoSelecionado = maquinas.find(eqp => equipamentoIdRef.current.value === eqp.maqNome)?.maqId || 'nulo';
    } else if (tipoEquipamento === 'Implemento') {
      equipamentoSelecionado = implementos.find(eqp => equipamentoIdRef.current.value === eqp.impNome)?.impId || 'nulo';
    } else if (tipoEquipamento === 'Peça') {
      equipamentoSelecionado = pecas.find(eqp => equipamentoIdRef.current.value === eqp.pecNome)?.pecId || 'nulo';
    }

    const dados = {
      manId: id,
      manDataInicio: dataInicioRef.current.value,
      manDescricao: descricaoRef.current.value,
      maqEqpTipoNovo: tipoEquipamento,
      manEqpIdNovo: equipamentoSelecionado,
      maqEqpTipoAntigo: manutencaoSelecionada.maqEqpTipo,
      manEqpIdAntigo: manutencaoSelecionada.manEqpId
    };

    if (verificaCampoVazio(dados)) {
      alertMsg.current.className = 'alertError';
      alertMsg.current.style.display = 'block';
      alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    if (equipamentoSelecionado === 'nulo') {
      alertMsg.current.className = 'alertError';
      alertMsg.current.style.display = 'block';
      alertMsg.current.textContent = `${tipoEquipamento} não cadastrado`;
      return;
    }

    httpClient.put("/manutencao", dados)
      .then(r => {
        const status = r.status;
        return r.json().then(data => ({
          status,
          data
        }));
      })
      .then(({ status, data }) => {
        alertMsg.current.className = status === 201 ? 'alertSuccess' : 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = data.msg;
      });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Manutenção</h1>
      </article>

      <article ref={alertMsg}></article>

      <form ref={formRef}>
        <section className="input-group">
          <section>
            <label>Tipo de Equipamento</label>
            <select
              name="tipoEquipamento"
              ref={tipoEquipamentoRef}
              value={tipoEquipamento}
              onChange={(e) => setTipoEquipamento(e.target.value)}
              required
            >
              <option value="" disabled>Selecione o tipo do equipamento</option>
              <option value="Máquina">Máquina</option>
              <option value="Peça">Peça</option>
              <option value="Implemento">Implemento</option>
            </select>
          </section>

          <section>
            <label>Data de início da manutenção</label>
            <input type="date" name="manDataInicio" ref={dataInicioRef} required />
          </section>
        </section>

        <section className="input-equipamento-width-100">
          <label>Nome do Equipamento</label>
          <input
            list="equipamentos"
            name="equipamentoId"
            className="datalist"
            ref={equipamentoIdRef}
            defaultValue={manutencaoSelecionada.manEqpNome} 
            disabled={!tipoEquipamento}
            style={{ cursor: !tipoEquipamento ? 'not-allowed' : 'text' }}
          />
          {verificaTipoEquipamento()}
          <p style={{ display: !tipoEquipamento ? 'block' : 'none' }} className="msg-obs">* Primeiro selecione o tipo do equipamento</p>
        </section>

        <section>
          <label>Descrição da Manutenção</label>
          <textarea 
            name="manDescricao" 
            ref={descricaoRef} 
            maxLength="150" 
            required 
          />
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/manutencao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={alterarManutencao}>Alterar Manutenção</button>
        </section>
      </form>
    </section>
  );
}
