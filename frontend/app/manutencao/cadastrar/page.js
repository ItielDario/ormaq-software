'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function CadastrarManutencao() {

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
  const alertMsg = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    httpClient.get("/maquina/obter/disponivel").then(r => r.json()).then(r => setMaquinas(r));
    httpClient.get("/peca/obter/disponivel").then(r => r.json()).then(r => setPecas(r));
    httpClient.get("/implemento/obter/disponivel").then(r => r.json()).then(r => setImplementos(r));
  }, []);

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

  const cadastrarManutencao = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;  
    let equipamentoSelecionado = 'nulo'

    // Obtem os dados do equipamento selecionado
    if(tipoEquipamento === 'Máquina'){
      equipamentoSelecionado = maquinas.find(eqp => equipamentoIdRef.current.value == eqp.maqNome);
      equipamentoSelecionado = equipamentoSelecionado !== undefined ? equipamentoSelecionado.maqId : 'nulo';
    }
    else if(tipoEquipamento === 'Implemento'){
      equipamentoSelecionado = implementos.find(eqp => equipamentoIdRef.current.value == eqp.impNome);
      equipamentoSelecionado = equipamentoSelecionado !== undefined ? equipamentoSelecionado.impId : 'nulo';
    }
    else if(tipoEquipamento === 'Peça'){
      equipamentoSelecionado = pecas.find(eqp => equipamentoIdRef.current.value == eqp.pecNome);
      equipamentoSelecionado = equipamentoSelecionado !== undefined ? equipamentoSelecionado.pecId : 'nulo';
    }

    const dados = {
      manDataInicio: dataInicioRef.current.value,
      manDescricao: descricaoRef.current.value,
      maqEqpTipo: tipoEquipamento,
      manEqpId: equipamentoSelecionado
    };

    // Verifica se os campos estão preenchidos
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios!';
      }, 100);
      return;
    }

    // Verifica o equipamento está cadastrado
    if (equipamentoSelecionado == 'nulo') {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = `${tipoEquipamento} não cadastrado`;
      }, 100);
      return;
    }

    httpClient.post("/manutencao/cadastrar", dados)
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

      if (status === 201) {
        formRef.current.reset();
        setTipoEquipamento('');
      }
    });

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Manutenção</h1>
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
            disabled={!tipoEquipamento}
            style={{ cursor: !tipoEquipamento ? 'not-allowed' : 'text' }}
          />
          {verificaTipoEquipamento()}
          <p style={{ display: !tipoEquipamento ? 'block' : 'none' }} className="msg-obs">* Primeiro selecione o tipo do equipamento</p>
        </section>

        <section>
          <label>Descrição da Manutenção</label>
          <textarea name="manDescricao" ref={descricaoRef} maxLength="150" required />
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/manutencao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={cadastrarManutencao}>Cadastrar Manutenção</button>
        </section>
      </form>
    </section>
  );
}