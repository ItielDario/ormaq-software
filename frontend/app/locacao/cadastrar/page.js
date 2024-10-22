'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function CadastrarLocacao() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);

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
  const valorUnitarioRef = useRef(null);

  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);
  const [tipoEquipamento, setTipoEquipamento] = useState(''); // Armazena o tipo selecionado

  useEffect(() => {
    httpClient.get("/cliente")
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        setClientes(r);
      });
    // httpClient.get("/equipamento").then((response) => setEquipamentos(response.data));
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
    const equipamentoId = equipamentoIdRef.current.value;
    const quantidade = quantidadeRef.current.value;
    const valorUnitario = valorUnitarioRef.current.value;

    setItensLocacao([...itensLocacao, { equipamentoId, quantidade, valorUnitario }]);
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
            setItensLocacao([]);
          }, 100);
        });
    }
    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
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
          
          <section>
            <article>
              <label>Tipo do Equipamento:</label>
            </article>

            <article className="tipo-equipamento">
              <label>
                <input
                  type="radio"
                  name="tipoEquipamento"
                  value="Máquina"
                  onChange={() => setTipoEquipamento('Máquina')}
                  required
                /> Máquina
              </label>

              <label>
                <input
                  type="radio"
                  name="tipoEquipamento"
                  value="Implemento"
                  onChange={() => setTipoEquipamento('Implemento')}
                /> Implemento
              </label>

              <label>
                <input
                  type="radio"
                  name="tipoEquipamento"
                  value="Peça"
                  onChange={() => setTipoEquipamento('Peça')}
                /> Peça
              </label>
            </article>            
          </section>

          <section className="input-group-equipamento">
            <section className="input-equipamento">
              <label>Nome do Equipamento</label>
              <input list="equipamentos" name="equipamentoId" className="datalist" ref={equipamentoIdRef} tooltip={'enable'} disabled={!tipoEquipamento} />
              <datalist id="equipamentos">
                {equipamentos.map(equipamento => (
                  <option key={equipamento.id} value={equipamento.id}>
                    {equipamento.nome}
                  </option>
                ))}
              </datalist>
              <p className="msg-obs">* Primeiro selecione o tipo do equipamento </p>
            </section>

            <section className="input-quantidade">
              <label>Quantidade</label>
              <input type="number" name="quantidade" ref={quantidadeRef} />
            </section>
          </section>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Data de Aquisição</th>
                <th>Preço por Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            
            <tbody>
              {itensLocacao.map((item, index) => (
                <tr key={index}>
                  <td>{item.equipamentoId}</td>
                  <td>{equipamentos.find(eq => eq.id === item.equipamentoId)?.nome}</td>
                  <td>aaaaaaaaaaaa</td>
                  <td>{item.quantidade}</td>
                  <td>{item.valorUnitario}</td>
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