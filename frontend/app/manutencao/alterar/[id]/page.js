'use client'; 
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function AlterarManutencao({ params: { id } }) {
  // Campos do formulário
  const dataInicioRef = useRef(null);
  const descricaoRef = useRef(null);
  
  // Campos dos Equipamentos
  const tipoEquipamentoRef = useRef(null);
  const equipamentoIdRef = useRef(null);
  
  // Variáveis Auxiliares
  const [maquinas, setMaquinas] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [implementos, setImplementos] = useState([]);
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState({});
  const alertMsg = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    httpClient.get("/maquina").then(r => r.json()).then(r => setMaquinas(r));
    httpClient.get("/peca").then(r => r.json()).then(r => setPecas(r));
    httpClient.get("/implemento").then(r => r.json()).then(r => setImplementos(r));
    
    // Carregar os dados da manutenção selecionada
    httpClient.get(`/manutencao/${id}`)
    .then(r => r.json())
    .then(data => {
      console.log(data)
      
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
            key={equipamento[Object.keys(equipamento)[0]]}
            value={equipamento[Object.keys(equipamento)[1]]}
          />
        ))}
      </datalist>
    );
  };

  const alterarManutencao = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;
    let equipamentoSelecionado = 'nulo';

    // Obtem os dados do equipamento selecionado
    if(tipoEquipamento === 'Máquina') {
      equipamentoSelecionado = maquinas.find(eqp => equipamentoIdRef.current.value === eqp.maqNome)?.maqId || 'nulo';
    } else if(tipoEquipamento === 'Implemento') {
      equipamentoSelecionado = implementos.find(eqp => equipamentoIdRef.current.value === eqp.impNome)?.impId || 'nulo';
    } else if(tipoEquipamento === 'Peça') {
      equipamentoSelecionado = pecas.find(eqp => equipamentoIdRef.current.value === eqp.pecaNome)?.pecaId || 'nulo';
    }

    const dados = {
      manId: id,
      manDataInicio: dataInicioRef.current.value,
      manDescricao: descricaoRef.current.value,
      manMaqTipo: tipoEquipamento,
      manEqpId: equipamentoSelecionado
    };

    console.log(dados)

    // Verifica campos vazios e existência do equipamento
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios';
      }, 100);
      return;
    }

    // Verifica se o equipamento está cadastrado
    if (equipamentoSelecionado === 'nulo') {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = `${tipoEquipamento} não cadastrado`;
      }, 100);
      return;
    }

    // Enviar requisição para atualizar a manutenção
    httpClient.put("/manutencao", dados)
    .then(r => {
      status = r.status;
      return r.json();
    })
    .then(r => {
      setTimeout(() => {
        alertMsg.current.className = status === 201 ? 'alertSuccess' : 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = r.msg;
      }, 100);
    });

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
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