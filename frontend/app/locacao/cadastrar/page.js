'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function CadastrarLocacao() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const alertMsgEqp = useRef(null);

  // Campos do formulário
  const clienteIdRef = useRef(null);
  const dataInicioRef = useRef(null);
  const dataFinalPrevistaRef = useRef(null);
  const dataFinalEntregaRef = useRef(null);
  const valorTotalRef = useRef(null);
  const descontoRef = useRef(null);
  const valorFinalRef = useRef(null);
  const usuarioIdRef = useRef(null);
  const statusRef = useRef(null);

  // Itens de locação
  const equipamentoIdRef = useRef(null);
  const quantidadeRef = useRef(null);

  const [clientes, setClientes] = useState([]);
  const [maquina, setMaquina] = useState([]);
  const [peca, setPeca] = useState([]);
  const [implemento, setImplemento] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);
  const [tipoEquipamento, setTipoEquipamento] = useState(''); // Armazena o tipo selecionado

  useEffect(() => {
    // Clientes
    httpClient.get("/cliente").then(r => r.json()).then(r => setClientes(r));
    httpClient.get("/maquina").then(r => r.json()).then(r => setMaquina(r));
    httpClient.get("/peca").then(r => r.json()).then(r => setPeca(r));
    httpClient.get("/implemento").then(r => r.json()).then(r => setImplemento(r));
  }, []);
  

  const verificaClienteExiste = () => {
    if (clienteIdRef.current.value.length > 0) {
      const clienteNome = clientes.map(cli => cli.cliNome);
      const result = clienteNome.some((value) => value == clienteIdRef.current.value);
      alertMsg.current.style.display = 'none';

      if (!result) {
        setTimeout(() => {
          alertMsg.current.className = 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = 'Cliente não cadastrado!';
        }, 100);
      }
    }
  };

  const adicionarItemLocacao = () => {
    alertMsgEqp.current.style.display = 'none';

    if (equipamentoIdRef.current.value.length > 0 && quantidadeRef.current.value > 0) {
      let equipamentoNome = [];
      let equipamentoDados = '';

      if(tipoEquipamento == "Máquina"){
        equipamentoNome = maquina.map(maq => maq.maqNome);
        equipamentoDados = maquina.filter(value => value.maqNome == equipamentoIdRef.current.value)
        console.log(equipamentoDados[0])
        equipamentoDados = {
          'id': equipamentoDados[0].maqId,
          'nome': equipamentoDados[0].maqNome,
          'data': equipamentoDados[0].maqDataAquisicao,
          'preco': '',
          'quantidade': quantidadeRef.current.value,
        }
        console.log(equipamentoDados)
      }
      else if(tipoEquipamento == "Peça"){
        equipamentoNome = peca.map(pec => pec.pecaNome);
        equipamentoDados = peca.filter(value => value.pecaNome == equipamentoIdRef.current.value)
        equipamentoDados = {
          'id': equipamentoDados[0].pecaId,
          'nome': equipamentoDados[0].pecaNome,
          'data': equipamentoDados[0].pecaDataAquisicao,
          'preco': '',
          'quantidade': quantidadeRef.current.value,
        }
      }
      else if(tipoEquipamento == "Implemento"){
        equipamentoNome = implemento.map(imp => imp.impNome);
        equipamentoDados = implemento.filter(value => value.impNome == equipamentoIdRef.current.value)
        equipamentoDados = {
          'id': equipamentoDados[0].impId,
          'nome': equipamentoDados[0].impNome,
          'data': equipamentoDados[0].impDataAquisicao,
          'preco': '',
          'quantidade': quantidadeRef.current.value,
        }
      }

      const result = equipamentoNome.some((value) => value == equipamentoIdRef.current.value);

      if (!result) {
        setTimeout(() => {
          alertMsgEqp.current.className = 'alertError';
          alertMsgEqp.current.style.display = 'block';
          alertMsgEqp.current.textContent = `${tipoEquipamento} não cadastrado!`;
        }, 100);
      }
      else {
        setItensLocacao([...itensLocacao, equipamentoDados]);
        setTimeout(() => {
          alertMsgEqp.current.className = 'alertSuccess';
          alertMsgEqp.current.style.display = 'block';
          alertMsgEqp.current.textContent = `${tipoEquipamento} inserido na lista com sucesso!`;
        }, 100);
        equipamentoIdRef.current.value = ''
        quantidadeRef.current.value = ''
      }      
    }
    else{
      setTimeout(() => {
        alertMsgEqp.current.className = 'alertError';
        alertMsgEqp.current.style.display = 'block';
        alertMsgEqp.current.textContent = `Por favor, digite um equipemento e sua quantidade!`;
      }, 100);
    }
    
  };

  const excluirItem = (index) => {
    const novaLista = itensLocacao.filter((item, i) => i !== index);
    setItensLocacao(novaLista);
  };

  const cadastrarLocacao = () => {
  alertMsg.current.style.display = 'none';

  const dados = {
    locDataInicio: dataInicioRef.current.value,
    locDataFinalPrevista: dataFinalPrevistaRef.current.value,
    locDataFinalEntrega: dataFinalEntregaRef.current.value,
    locValorTotal: valorTotalRef.current.value,
    locDesconto: descontoRef.current.value,
    locValorFinal: valorFinalRef.current.value,
    locCliId: clienteIdRef.current.value,
    locUsuId: usuarioIdRef.current.value,
    locStatus: statusRef.current.value,
    itens: itensLocacao, // Array de itens da locação
  };

  if (verificaCampoVazio(dados)) {
    setTimeout(() => {
      alertMsg.current.className = 'alertError';
      alertMsg.current.style.display = 'block';
      alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
    }, 100);
  } else {
    httpClient.post("/locacao/cadastrar", dados)
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then(r => {
        setTimeout(() => {
          if (status == 201) {
            alertMsg.current.className = 'alertSuccess';
          } else {
            alertMsg.current.className = 'alertError';
          }

          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = r.msg;
          
          formRef.current.reset();
          setTipoEquipamento(''); // Isso desmarca os radio buttons
          setItensLocacao([]);
        }, 100);
      });
  }
  document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
};

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  const verificaTipoEquipamento = () => {
    const listaEquipamentos = {
      'Máquina': maquina,
      'Peça': peca,
      'Implemento': implemento,
    };
  
    const equipamentos = listaEquipamentos[tipoEquipamento] || [];
  
    return (
      <datalist id="equipamentos">
        {equipamentos.map((equipamento) => (
          <option
            key={equipamento[Object.keys(equipamento)[0]]} // Usa o primeiro valor como chave
            value={equipamento[Object.keys(equipamento)[1]]} // Usa o segundo valor como nome
          />
        ))}
      </datalist>
    );
  };   
  
  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Locação</h1>
      </article>

      <article ref={alertMsg}></article>

      <form ref={formRef}>
        <section className="input-group">
          <section className="input-cliente">
            <label>Cliente (Nome / CPF / CNPJ)</label>
            <input list="clientes" name="locCliId" onBlur={verificaClienteExiste} className="datalist" ref={clienteIdRef} required />
            <datalist id="clientes">
              {clientes.map(cliente => (
                <option key={cliente.cliId} value={cliente.cliNome}>
                  {cliente.cliCPF_CNPJ}
                </option>
              ))}
            </datalist>
          </section>

          <article className="box-cadastrar-cliente">
            <a href={`/locacao/alterar/`}><i className="nav-icon fas fa-plus-circle"></i></a>
          </article>
        </section>

        <section className="input-group">
          <section>
            <label>Data de início da locação</label>
            <input type="date" name="locDataInicio" ref={dataInicioRef} required />
          </section>

          <section>
            <label>Data de término da locação</label>
            <input type="date" name="locDataFinalPrevista" ref={dataFinalPrevistaRef} required />
          </section>
        </section>

        <section className="itens-locacao">
          <article className="itens-locacao-header">
            <p>Itens da Locação</p>
            <button type="button" className='btn-add' onClick={adicionarItemLocacao}>Adicionar Item</button>
          </article>

          <article ref={alertMsgEqp}></article>
          
          <section>
            <article>
              <label>Tipo do Equipamento:</label>
            </article>

            <article className="tipo-equipamento">
              <label><input type="radio" name="tipoEquipamento" value="Máquina" onChange={() => setTipoEquipamento('Máquina')} require /> Máquina </label>
              <label><input type="radio" name="tipoEquipamento" value="Implemento" onChange={() => setTipoEquipamento('Implemento')}/> Implemento</label>
              <label><input type="radio" name="tipoEquipamento" value="Peça" onChange={() => setTipoEquipamento('Peça')}/> Peça</label>
            </article>            
          </section>

          <section className="input-group-equipamento">
            <section className="input-equipamento">
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


            <section className="input-quantidade">
              <label>Quantidade</label>
              <input type="number" name="quantidade" ref={quantidadeRef} />
            </section>
          </section>

          <table id="table-itens-locacao">
            <thead>
              <tr className="thead-itens-locacao">
                <th>ID</th>
                <th>Nome</th>
                <th>Data de Aquisição</th>
                <th>Preço por Hora</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="tbody-itens-locacao">
              {itensLocacao.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.data}</td>
                  <td>{item.preco}</td>
                  <td>{item.quantidade}</td>
                  <td><a onClick={() => excluirItem(index)}><i className="nav-icon fas fa-trash"></i></a></td>
                </tr>
              ))}
            </tbody>
          </table>

          <article className="itens-locacao-footer">
            <strong>Valor total: </strong>
            <strong className="valor-total-box">R$ 1000,00</strong>
          </article>
        </section>

        <section>
          <label>Desconto</label>
          <input type="number" name="locDesconto" ref={descontoRef} />
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/locacao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={cadastrarLocacao}>Cadastrar Locação</button>
        </section>
      </form>
    </section>
  );
}