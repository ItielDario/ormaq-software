'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function CadastrarLocacao() {

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

  //Variaveis Auxiliares
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
    httpClient.get("/maquina").then(r => r.json()).then(r => setMaquina(r));
    httpClient.get("/peca").then(r => r.json()).then(r => setPeca(r));
    httpClient.get("/implemento").then(r => r.json()).then(r => setImplemento(r));
  }, []);
  
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

  const obterClienteIdSelecionado = () => { // Função para retornar o ID do cliente selecionado
    return clienteIdRef.current.dataset.clienteId || null;
  };

  const adicionarItemLocacao = () => {
    alertMsg.current.style.display = 'none';
    let result = false;
  
    if (equipamentoIdRef.current.value.length > 0 && quantidadeRef.current.value > 0) {
      let equipamentoNome = [];
      let equipamentoDados = '';
  
      if (tipoEquipamento === "Máquina") { // VERIFICA SE O EQUIPAMENTO É UMA MÁQUINA
        equipamentoNome = maquina.map(maq => maq.maqNome);
        equipamentoDados = maquina.filter(value => value.maqNome === equipamentoIdRef.current.value);
        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            id: equipamentoDados[0].maqId,
            tipo: 'Máquina',
            nome: equipamentoDados[0].maqNome,
            preco: equipamentoDados[0].maqPrecoHora,
            quantidade: quantidadeRef.current.value,
          };
        }
      } 
      else if (tipoEquipamento === "Peça") { // VERIFICA SE O EQUIPAMENTO É UMA PEÇA
        equipamentoNome = peca.map(pec => pec.pecaNome);
        equipamentoDados = peca.filter(value => value.pecaNome === equipamentoIdRef.current.value);
        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            id: equipamentoDados[0].pecaId,
            tipo: 'Peça',
            nome: equipamentoDados[0].pecaNome,
            preco: equipamentoDados[0].pecaPrecoHora,
            quantidade: quantidadeRef.current.value,
          };
        }
      } 
      else if (tipoEquipamento === "Implemento") { // VERIFICA SE O EQUIPAMENTO É UM IMPLEMENTO
        equipamentoNome = implemento.map(imp => imp.impNome);
        equipamentoDados = implemento.filter(value => value.impNome === equipamentoIdRef.current.value);
  
        if (equipamentoDados.length > 0) {
          result = true;
          equipamentoDados = {
            id: equipamentoDados[0].impId,
            tipo: 'Implemento',
            nome: equipamentoDados[0].impNome,
            preco: equipamentoDados[0].impPrecoHora,
            quantidade: quantidadeRef.current.value,
          };
        }
      }
  
      if (result) {
        const listaItensAuxiliar = [...itensLocacao, equipamentoDados];
        setItensLocacao(listaItensAuxiliar);
  
        let valorTotal = listaItensAuxiliar.reduce((total, equip) => total + equip.preco * equip.quantidade, 0);
        valorTotalRef.current.innerHTML = `R$ ${valorTotal.toFixed(2)}`;       
        setvalorTotal(valorTotal);
  
        // Executa a função calcularValorFinal sempre que um item é adicionado
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
    // Remove o item da lista de itens de locação
    const novaLista = itensLocacao.filter((item, i) => i !== index);
    setItensLocacao(novaLista);
  
    // Recalcula o valor total com base na nova lista
    let novoValorTotal = novaLista.reduce((total, item) => total + item.preco * item.quantidade, 0);
    setvalorTotal(novoValorTotal);
    valorTotalRef.current.innerHTML = `R$ ${novoValorTotal.toFixed(2)}`;
  
    // Recalcula o valor final com o desconto
    calcularValorFinal(descontoRef.current.value, novoValorTotal);
  };
  
  const cadastrarLocacao = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    const dados = {
      locDataInicio: dataInicioRef.current.value,
      locDataFinalPrevista: dataFinalPrevistaRef.current.value,
      locValorTotal: valorTotal,
      locDesconto: descontoRef.current.value,
      locValorFinal: parseFloat(valorFinalRef.current.innerHTML.replace('R$ ', '').replace(',', '.')),
      locCliId: obterClienteIdSelecionado(), // Usa o ID do cliente
      itens: itensLocacao, // Array de itens da locação
    };
  
    // Validação de campos vazios
    if (verificaCampoVazio(dados) || itensLocacao.length === 0) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item de locação!';
        document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      }, 100);
      return;
    }
  
    // Validação de data
    const dataInicio = new Date(dataInicioRef.current.value);
    const dataFinalPrevista = new Date(dataFinalPrevistaRef.current.value);
    
    if (dataInicio >= dataFinalPrevista) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'A data de início da locação deve ser anterior à data de término!';
        document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      }, 100);
      return;
    }
  
    // Validação do valor de desconto
    if (parseFloat(descontoRef.current.value) > valorTotal) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'O valor do desconto não pode ser maior que o valor total.';
        document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      }, 100);
      return;
    }
  
    httpClient.post("/locacao/cadastrar", dados) 
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then(r => {
        setTimeout(() => {
          alertMsg.current.className = status === 201 ? 'alertSuccess' : 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = r.msg;
  
          if (status === 201) {
            formRef.current.reset();
            setTipoEquipamento('');
            setItensLocacao([]);
            setvalorTotal(0);
            valorTotalRef.current.innerHTML = 'R$ 00,00';
            valorFinalRef.current.innerHTML = '0';
            containerValorTotalRef.current.style.display = 'none'
            descontoRef.current.style.width = '100%'
          }
        }, 100);
      });
      
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

  const calcularValorFinal = (valorDesconto, valorTotal) => {
    if(valorDesconto >= 0){
      valorFinalRef.current.innerHTML = `R$ ${(valorTotal - descontoRef.current.value).toFixed(2)}`
      containerValorTotalRef.current.style.display = 'flex'
      descontoRef.current.style.width = '95%'
    }
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
            <a href={`/cliente/cadastrar/`}><i className="nav-icon fas fa-plus-circle"></i></a>
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
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.tipo}</td>
                  <td>{item.preco}</td>
                  <td>{item.quantidade}</td>
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
            <input type="number" onChange={(e) => calcularValorFinal(e.target.value, valorTotal)}  name="locDesconto" ref={descontoRef} defaultValue={0}/>
          </article>

          <article ref={containerValorTotalRef} className="box-valor-final">
            <strong>Valor Final com Desconto: </strong>
            <strong className="valor-total-box" ref={valorFinalRef}>0</strong>
          </article>
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/locacao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={cadastrarLocacao}>Cadastrar Locação</button>
        </section>
      </form>
    </section>
  );
}