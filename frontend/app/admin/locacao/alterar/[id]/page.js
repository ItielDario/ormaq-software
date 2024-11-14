'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "../../../utils/httpClient.js";

export default function AlterarLocacao({ params: { id } }) {

  // Campos do formulário
  const clienteIdRef = useRef(null);
  const dataInicioRef = useRef(null);
  const dataFinalPrevistaRef = useRef(null);
  const valorFinalRef = useRef(null);
  const descontoRef = useRef(null);

  // Itens de locação
  const tipoEquipemantoRef = useRef(null);
  const equipamentoIdRef = useRef(null);
  const quantidadeRef = useRef(null);
  const valorTotalRef = useRef(null);

  // Variáveis Auxiliares
  const [locacaoSelecionada, setlocacaoSelecionada] = useState([])
  const [clientes, setClientes] = useState([]);
  const [maquina, setMaquina] = useState([]);
  const [peca, setPeca] = useState([]);
  const [implemento, setImplemento] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [valorTotal, setvalorTotal] = useState('');
  const containerValorTotalRef = useRef(null);
  const formRef = useRef(null);
  const alertMsg = useRef(null);

  useEffect(() => {
    httpClient.get("/cliente").then(r => r.json()).then(r => setClientes(r));
    httpClient.get("/maquina/obter/disponivel").then(r => r.json()).then(r => setMaquina(r));
    httpClient.get("/peca/obter/disponivel").then(r => r.json()).then(r => setPeca(r));
    httpClient.get("/implemento/obter/disponivel").then(r => r.json()).then(r => setImplemento(r));

    httpClient.get(`/locacao/${id}`)
    .then(r => r.json())
    .then((r) => {
      r.locacao.locDataInicio = new Date(r.locacao.locDataInicio).toISOString().split('T')[0];
      r.locacao.locDataFinalPrevista = new Date(r.locacao.locDataFinalPrevista).toISOString().split('T')[0];
      let valorTotalAux = r.itensLocacao.reduce((total, equip) => total + equip.iteLocValorUnitario * equip.iteLocQuantidade, 0);
      valorTotalRef.current.innerHTML = `R$ ${valorTotalAux.toFixed(2)}`;
      clienteIdRef.current.dataset.clienteId = r.locacao.cliId

      setlocacaoSelecionada(r.locacao);
      setItensLocacao(r.itensLocacao);
      setvalorTotal(valorTotalAux);
      
      calcularValorFinal(r.locacao.locDesconto, valorTotalAux);
      
    });
  }, [id]);

  const verificaClienteExiste = () => {
    if (clienteIdRef.current.value.length > 0) {
      const cliente = clientes.find(cli => cli.cliNome === clienteIdRef.current.value);
      
      if (cliente) {
        alertMsg.current.style.display = 'none';
        clienteIdRef.current.dataset.clienteId = cliente.cliId;
      } else {
        setTimeout(() => {
          alertMsg.current.className = 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = 'Cliente não cadastrado!';
        }, 100);
      }
    }
  };

  const adicionarItemLocacao = () => {
    alertMsg.current.style.display = 'none';
    let result = false;

    if (equipamentoIdRef.current.value.length > 0 && quantidadeRef.current.value > 0) {
      let equipamentoNome = [];
      let equipamentoDados = '';

      if (tipoEquipamento === "Máquina") {
        equipamentoNome = maquina.map(maq => maq.maqNome);
        equipamentoDados = maquina.filter(value => value.maqNome === equipamentoIdRef.current.value);
        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            iteLocId: equipamentoDados[0].maqId,
            iteLocTipo: 'Máquina',
            iteLocNome: equipamentoDados[0].maqNome,
            iteLocValorUnitario: equipamentoDados[0].maqPrecoHora,
            iteLocQuantidade: quantidadeRef.current.value,
          };
        }
      } 
      else if (tipoEquipamento === "Peça") {
        equipamentoNome = peca.map(pec => pec.pecNome);
        equipamentoDados = peca.filter(value => value.pecNome === equipamentoIdRef.current.value);
        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            iteLocId: equipamentoDados[0].pecId,
            iteLocTipo: 'Peça',
            iteLocNome: equipamentoDados[0].pecNome,
            iteLocValorUnitario: equipamentoDados[0].pecPrecoHora,
            iteLocQuantidade: quantidadeRef.current.value,
          };
        }
      } 
      else if (tipoEquipamento === "Implemento") {
        equipamentoNome = implemento.map(imp => imp.impNome);
        equipamentoDados = implemento.filter(value => value.impNome === equipamentoIdRef.current.value);

        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            iteLocId: equipamentoDados[0].impId,
            iteLocTipo: 'Implemento',
            iteLocNome: equipamentoDados[0].impNome,
            iteLocValorUnitario: equipamentoDados[0].impPrecoHora,
            iteLocQuantidade: quantidadeRef.current.value,
          };
        }
      }

      if (result) {
        const listaItensAuxiliar = [...itensLocacao, equipamentoDados];
        setItensLocacao(listaItensAuxiliar);

        let valorTotal = listaItensAuxiliar.reduce((total, equip) => total + equip.iteLocValorUnitario * equip.iteLocQuantidade, 0);
        valorTotalRef.current.innerHTML = `R$ ${valorTotal.toFixed(2)}`;
        setvalorTotal(valorTotal);

        calcularValorFinal(descontoRef.current.value, valorTotal);

        setTipoEquipamento('');
        equipamentoIdRef.current.value = '';
        quantidadeRef.current.value = '';

        setTimeout(() => {
          alertMsg.current.className = 'alertSuccess';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = `${tipoEquipamento} inserido na lista com sucesso!`;
        }, 100);
      } else {
        setTimeout(() => {
          alertMsg.current.className = 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = `${tipoEquipamento} não cadastrado!`;
        }, 100);
      }
    } else {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = `Por favor, digite um equipamento e sua quantidade!`;
      }, 100);
    }

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const excluirItem = (index) => {
    const novaLista = itensLocacao.filter((item, i) => i !== index);
    setItensLocacao(novaLista);
    
    let novoValorTotal = novaLista.reduce((total, item) => total + item.iteLocValorUnitario * item.iteLocQuantidade, 0);
    setvalorTotal(novoValorTotal);
    valorTotalRef.current.innerHTML = `R$ ${novoValorTotal.toFixed(2)}`;

    calcularValorFinal(descontoRef.current.value, novoValorTotal);
  };

  const alterarLocacao = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    const dados = {
      locId: id,
      locDataInicio: dataInicioRef.current.value,
      locDataFinalPrevista: dataFinalPrevistaRef.current.value,
      locValorTotal: valorTotal,
      locDesconto: descontoRef.current.value,
      locValorFinal: parseFloat(valorFinalRef.current.innerHTML.replace('R$ ', '').replace(',', '.')),
      locCliId: clienteIdRef.current.dataset.clienteId,
      itens: itensLocacao,
    };

    if (verificaCampoVazio(dados) || itensLocacao.length === 0) {
      alertMsg.current.className = 'alertError';
      alertMsg.current.style.display = 'block';
      alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item de locação!';
      document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      return;
    }

    const dataInicio = new Date(dataInicioRef.current.value);
    const dataFinalPrevista = new Date(dataFinalPrevistaRef.current.value);
    
    if (dataInicio > dataFinalPrevista) {
      alertMsg.current.className = 'alertError';
      alertMsg.current.style.display = 'block';
      alertMsg.current.textContent = 'A data de início deve ser anterior à data final prevista!';
      document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      return;
    }

    httpClient.put(`/locacao`, dados)
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

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const calcularValorFinal = (valorDesconto, valorTotal) => {
    if(valorDesconto >= 0){
      valorFinalRef.current.innerHTML = `R$ ${(valorTotal - valorDesconto).toFixed(2)}`
      containerValorTotalRef.current.style.display = 'flex'
      descontoRef.current.style.width = '95%'
    }
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

  const obterClienteIdSelecionado = () => { // Função para retornar o ID do cliente selecionado
    return clienteIdRef.current.dataset.clienteId || null;
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
            <input defaultValue={locacaoSelecionada.cliNome} list="clientes" name="locCliId" onBlur={verificaClienteExiste} className="datalist" ref={clienteIdRef} required />
            <datalist  id="clientes">
              {clientes.map(cliente => (
                <option key={cliente.cliId} value={cliente.cliNome}>
                  {cliente.cliCPF_CNPJ}
                </option>
              ))}
            </datalist>
          </section>

          <article className="box-cadastrar-cliente">
            <a href={`/cliente/cadastrar/`}><i className="nav-icon fas fa-plus-circle"></i></a>
          </article>
        </section>

        <section className="input-group">
          <section>
            <label>Data de início da locação</label>
            <input defaultValue={locacaoSelecionada.locDataInicio} type="date" name="locDataInicio" ref={dataInicioRef} required />
          </section>

          <section>
            <label>Data de término da locação</label>
            <input defaultValue={locacaoSelecionada.locDataFinalPrevista} type="date" name="locDataFinalPrevista" ref={dataFinalPrevistaRef} required />
          </section>
        </section>

        <section className="itens-locacao">
          <article className="itens-locacao-header">
            <p>Itens da Locação</p>
            <button type="button" className='btn-add' onClick={adicionarItemLocacao}>Adicionar Item</button>
          </article>
          
          <section>
            <article>
              <label>Tipo do Equipamento:</label>
            </article>

            <article className="tipo-equipamento">
              <select 
                name="tipoEquipamento" 
                ref={tipoEquipemantoRef}
                value={tipoEquipamento} 
                onChange={(e) => setTipoEquipamento(e.target.value)} 
                required
              >
                <option value="" disabled>Selecione o tipo do equipamento</option>
                <option value="Máquina">Máquina</option>
                <option value="Implemento">Implemento</option>
                <option value="Peça">Peça</option>
              </select>
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
                <th>Tipo Equipamento</th>
                <th>Preço / Hora</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="tbody-itens-locacao">
              {itensLocacao.map((item, index) => (
                <tr key={index}>
                  <td>{item.iteLocId}</td>
                  <td>{item.iteLocNome}</td>
                  <td>{item.iteLocTipo}</td>
                  <td>{item.iteLocValorUnitario}</td>
                  <td>{item.iteLocQuantidade}</td>
                  <td><a onClick={() => excluirItem(index)}><i className="nav-icon fas fa-trash"></i></a></td>
                </tr>
              ))}
            </tbody>
          </table>

          <article className="itens-locacao-footer">
            <strong>Valor total: </strong>
            <strong className="valor-total-box" ref={valorTotalRef}>R$ 00,00</strong>
          </article>
        </section>

        <section className="container-valor-final">
          <article className="box-desconto">
            <label>Desconto</label>
            <input type="number" onChange={(e) => calcularValorFinal(e.target.value, valorTotal)} defaultValue={locacaoSelecionada.locDesconto} name="locDesconto" ref={descontoRef}/>
          </article>

          <article ref={containerValorTotalRef} className="box-valor-final">
            <strong>Valor Final com Desconto: </strong>
            <strong className="valor-total-box" ref={valorFinalRef}>0</strong>
          </article>
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/admin/locacao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={alterarLocacao}>Alterar Locação</button>
        </section>
      </form>
    </section>
  );
}