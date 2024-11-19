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
  const equipamentoIdRef = useRef(null);
  const valorTotalRef = useRef(null);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState([]);

  //Variaveis Auxiliares
  const [clientes, setClientes] = useState([]);
  const [maquina, setMaquina] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);
  const [valorTotal, setvalorTotal] = useState('');
  const [locacaoBuscada, setLocacaoBuscada] = useState([]);
  const containerValorTotalRef = useRef(null);
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const containerInfoRef = useRef(null);

  useEffect(() => {
    // OBTEM O CLIENTE DESTA LOCAÇÃO
    httpClient.get("/cliente").then(r => r.json()).then(r => setClientes(r));

    // OBTEM AS MÁQUINAS COM STATUS DISPONÍVEL E AS MÁQUINAS QUE ESTÃO ALUGADAS NESSA LOCAÇÃO
    Promise.all([ 
      httpClient.get("/maquina/obter/disponivel").then(r => r.json()),
      httpClient.get(`/maquina/obter/locacao/${id}`).then(r => r.json())
    ])
    .then(([disponiveis, locacao]) => {
        const maquinasCombinadas = [...disponiveis, ...locacao.maquina];
        setMaquina(maquinasCombinadas);
    })
    .catch(error => {
        console.error("Erro ao buscar máquinas:", error);
    });

    // OBTEM OS DADOS DESTA LOCAÇÃO
    httpClient.get(`/locacao/${id}`)
    .then(r => r.json())
    .then(r => {
      r.locacao.locDataFinalPrevista = new Date(r.locacao.locDataFinalPrevista).toISOString().split('T')[0];
      r.locacao.locDataInicio = new Date(r.locacao.locDataInicio).toISOString().split('T')[0];

      let valorTotalAux = r.itensLocacao.reduce((total, equip) => total + Number(equip.iteLocValorUnitario), 0);
      valorTotalRef.current.innerHTML = `R$ ${valorTotalAux}`;
      clienteIdRef.current.dataset.clienteId = r.locacao.cliId

      setLocacaoBuscada(r.locacao); 
      setItensLocacao(r.itensLocacao); 
      setvalorTotal(valorTotalAux);
      
      calcularValorFinal(r.locacao.locDesconto, valorTotalAux);
    });
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

  function calcularDiferencaDias(dataInicio, dataFinalPrevista) {
    // Converter as datas para o formato UTC para evitar problemas de fuso horário
    const inicioUTC = Date.UTC(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
    const finalUTC = Date.UTC(dataFinalPrevista.getFullYear(), dataFinalPrevista.getMonth(), dataFinalPrevista.getDate());

    // Calcular a diferença em milissegundos e converter para dias
    const diferencaMilissegundos = finalUTC - inicioUTC;
    const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);

    return diferencaDias + 1;
  };

  const adicionarItemLocacao = () => {
    alertMsg.current.style.display = 'none';
    let result = false;

    // Validação da data de início e término
    const dataInicio = new Date(dataInicioRef.current.value);
    const dataFinalPrevista = new Date(dataFinalPrevistaRef.current.value);

    if (dataInicio == "Invalid Date" && dataFinalPrevista == "Invalid Date") {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Primeiro preencha data de início e de término da locação';
        document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      }, 100);
      return;
    }

    if (dataInicio > dataFinalPrevista) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'A data de início da locação deve ser anterior à data de término!';
        document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      }, 100);
      return;
    }

    // Verifica se a máquina existe
    if (equipamentoIdRef.current.value.length > 0) {
      let equipamentoDados = '';
      const dias = calcularDiferencaDias(dataInicio, dataFinalPrevista);
      let valorMaquina = null;
      let planoAluguel = null;

      equipamentoDados = maquina.filter(value => value.maqSerie === equipamentoIdRef.current.value);

      if (equipamentoDados.length > 0) {
        // Verifica se a máquina já está na lista de locações
        const jaAdicionada = itensLocacao.some(
          item => item.maqId === equipamentoDados[0].maqId
        );

        if (jaAdicionada) {
          setTimeout(() => {
            alertMsg.current.className = 'alertError';
            alertMsg.current.style.display = 'block';
            alertMsg.current.textContent = `A máquina já foi adicionada à lista de locações!`;
          }, 100);
          return;
        }

        // Cálculo do valor baseado no período
        if (dias < 7) {
          valorMaquina = equipamentoDados[0].maqAluPrecoDiario * dias;
          planoAluguel = "Diária";
        } else if (dias < 15) {
          valorMaquina = (equipamentoDados[0].maqAluPrecoSemanal / 7) * dias;
          planoAluguel = "Semanal";
        } else if (dias < 30) {
          valorMaquina = (equipamentoDados[0].maqAluPrecoQuinzenal / 15) * dias;
          planoAluguel = "Quinzenal";
        } else {
          valorMaquina = (equipamentoDados[0].maqAluPrecoMensal / 30) * dias;
          planoAluguel = "Mensal";
        }

        valorMaquina = Number(valorMaquina.toFixed(0)); // Garantir que seja um número arredondado

        result = true;
        equipamentoDados = {
          maqId: equipamentoDados[0].maqId,
          maqNome: equipamentoDados[0].maqNome,
          maqModelo: equipamentoDados[0].maqModelo,
          maqSerie: equipamentoDados[0].maqSerie,
          iteLocValorUnitario: valorMaquina,
          iteLocPlanoAluguel: planoAluguel,
          iteLocQuantDias: dias,
        };
      }

      if (result) {
        const listaItensAuxiliar = [...itensLocacao, equipamentoDados];

        setItensLocacao(listaItensAuxiliar);

        let valorTotal = listaItensAuxiliar.reduce((total, equip) => total + Number(equip.iteLocValorUnitario), 0);
        valorTotalRef.current.innerHTML = `R$ ${valorTotal.toFixed(0)},00`;
        setvalorTotal(valorTotal);

        // Executa a função calcularValorFinal sempre que um item é adicionado
        calcularValorFinal(descontoRef.current.value, valorTotal);

        equipamentoIdRef.current.value = '';
        containerInfoRef.current.style.display = 'none';

        setTimeout(() => {
          alertMsg.current.className = 'alertSuccess';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = `Máquina inserida na lista com sucesso!`;
        }, 100);
      } else {
        setTimeout(() => {
          alertMsg.current.className = 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = `Máquina não cadastrada!`;
        }, 100);
      }
    } else {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = `Por favor, escolha uma máquina!`;
      }, 100);
    }

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const excluirItem = (index) => {
    // Remove o item da lista de itens de locação
    const novaLista = itensLocacao.filter((item, i) => item.maqId !== index);
    setItensLocacao(novaLista);
  
    // Recalcula o valor total com base na nova lista
    let novoValorTotal = novaLista.reduce((total, item) => total + Number(item.iteLocValorUnitario), 0);
    setvalorTotal(novoValorTotal);
    valorTotalRef.current.innerHTML = `R$ ${novoValorTotal.toFixed(0)},00`;
  
    // Recalcula o valor final com o desconto
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
    
    if (dataInicio > dataFinalPrevista) {
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
  
    httpClient.put("/locacao", dados) 
      .then((r) => {
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

  const calcularValorFinal = (valorDesconto, valorTotal) => {
    if(valorDesconto >= 0){
      valorFinalRef.current.innerHTML = `R$ ${(valorTotal - descontoRef.current.value).toFixed(0)},00`
      containerValorTotalRef.current.style.display = 'flex'
      descontoRef.current.style.width = '95%'
    }
  };   

  // Função para buscar os dados da máquina com base no chassi
  const buscarMaquinaPorSerie = () => {
    const serieDigitado = equipamentoIdRef.current.value;
    alertMsg.current.style.display = 'none';
    
    if (serieDigitado.length > 0) {
      // Filtra a máquina com o nome correspondente
      const maquinaEncontrada = maquina.find((m) => m.maqSerie === serieDigitado);
      
      if (maquinaEncontrada) {
        maquinaEncontrada.maqDataAquisicao = new Date(maquinaEncontrada.maqDataAquisicao).toLocaleDateString();
        setMaquinaSelecionada(maquinaEncontrada)
        alertMsg.current.style.display = 'none';
        containerInfoRef.current.style.display = 'block';
      } 
      else {
        setTimeout(() => {
          alertMsg.current.className = 'alertError';
          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = 'Máquina não encontrada!';

          document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
          containerInfoRef.current.style.display = 'none';
        }, 100);
      }
    }
    else{
      containerInfoRef.current.style.display = 'none';
    }
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Locação</h1>
      </article>

      <article ref={alertMsg}></article>

      <form ref={formRef}>
        <section className="input-group">
          <section className="input-cliente">
            <label>Cliente (Nome / CPF / CNPJ)</label>
            <input list="clientes" name="locCliId" defaultValue={locacaoBuscada.cliNome} onBlur={verificaClienteExiste} className="datalist" ref={clienteIdRef} required />
            <datalist id="clientes">
              {clientes.map(cliente => (
                <option key={cliente.cliId} value={cliente.cliNome}>
                  {cliente.cliCPF_CNPJ}
                </option>
              ))}
            </datalist>
          </section>

          <article className="box-cadastrar-cliente">
            <a href={`/admin/cliente/cadastrar`}><i className="nav-icon fas fa-plus-circle"></i></a>
          </article>
        </section>

        <section className="input-group">
          <section>
            <label>Data de início da locação</label>
            <input type="date" name="locDataInicio" ref={dataInicioRef} defaultValue={locacaoBuscada.locDataInicio}  required readonly onKeyDown={(e) => e.preventDefault()}/>
          </section>

          <section>
            <label>Data de término da locação</label>
            <input type="date" name="locDataFinalPrevista" ref={dataFinalPrevistaRef} defaultValue={locacaoBuscada.locDataFinalPrevista} required readonly onKeyDown={(e) => e.preventDefault()}/>
          </section>
        </section>

        <section className="itens-locacao">
          <article className="itens-locacao-header">
            <p>Itens da Locação</p>
            <button type="button" className='btn-add' onClick={adicionarItemLocacao}>Adicionar Item</button>
          </article>

          <section className="input-group-equipamento">
            <section className="input-equipamento">
              <label>Série / Chassi da Máquina</label>
              <input
                list="equipamentos"
                name="equipamentoId"
                className="datalist"
                ref={equipamentoIdRef}
                onBlur={buscarMaquinaPorSerie}
              />
              <datalist id="equipamentos">
                {maquina.map((maquina) => (
                  <option key={maquina.maqId} value={maquina.maqSerie}>
                    {maquina.maqNome + " - " + maquina.maqModelo}
                  </option>
                ))}
              </datalist>
              <p style={{ display: equipamentoIdRef.current && equipamentoIdRef.current.value === '' ? 'block' : 'none',}} className="msg-obs">
                * Primeiro digite a série / chassi da máquina
              </p>
            </section>
          </section>

          <article ref={containerInfoRef} className="container-info container-info-locacao">
              <h2 className="title-info">Dados da Máquina</h2>
              <p className="data-info"><strong>Nome da Máquina:</strong> {maquinaSelecionada.maqNome}</p>
              <p className="data-info"><strong>Modelo:</strong> {maquinaSelecionada.maqModelo}</p>
              <p className="data-info"><strong>Série:</strong> {maquinaSelecionada.maqSerie}</p>
              <p className="data-info"><strong>Tipo:</strong> {maquinaSelecionada.maqTipo}</p>
              <p className="data-info"><strong>Ano de Fabricação:</strong> {maquinaSelecionada.maqAnoFabricacao}</p>
              <p className="data-info"><strong>Data de Aquisição:</strong> {maquinaSelecionada.maqDataAquisicao}</p>
              <p className="data-info"><strong>Horas de Uso:</strong> {maquinaSelecionada.maqHorasUso}</p>
              <p className="data-info"><strong>Preço do Aluguel Diária:</strong> R$ {maquinaSelecionada.maqAluPrecoDiario}</p>
              <p className="data-info"><strong>Preço do Aluguel Semanal:</strong> R$ {maquinaSelecionada.maqAluPrecoSemanal}</p>
              <p className="data-info"><strong>Preço do Aluguel Quinzenal:</strong> R$ {maquinaSelecionada.maqAluPrecoQuinzenal}</p>
              <p className="data-info data-info-ultimo"><strong>Preço do Aluguel Mensal:</strong> R$ {maquinaSelecionada.maqAluPrecoMensal}</p>
          </article>

          <table id="table-itens-locacao">
            <thead>
              <tr className="thead-itens-locacao">
                <th>ID</th>
                <th>Nome</th>
                <th>Modelo</th>
                <th>Serie/Chassi </th>
                <th>Subtotal</th>
                <th>Plano</th>
                <th>Dias locado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className="tbody-itens-locacao">
              {itensLocacao.map((item) => (
                <tr key={item.maqId}>
                  <td>{item.maqId}</td>
                  <td>{item.maqNome}</td>
                  <td>{item.maqModelo}</td>
                  <td>{item.maqSerie}</td>
                  <td>R$ {Number(item.iteLocValorUnitario).toFixed(0)},00</td>
                  <td>{item.iteLocPlanoAluguel}</td>
                  <td>{item.iteLocQuantDias}</td>
                  <td><a onClick={() => excluirItem(item.maqId)}><i className="nav-icon fas fa-trash"></i></a></td>
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
            <input type="number" defaultValue={locacaoBuscada.locDesconto} onChange={(e) => calcularValorFinal(e.target.value, valorTotal)}  name="locDesconto" ref={descontoRef}/>
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