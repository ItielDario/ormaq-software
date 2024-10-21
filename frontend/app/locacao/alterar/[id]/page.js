'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";

export default function CadastrarLocacao() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);

  useEffect(() => {
    httpClient.get("/cliente").then((response) => setClientes(response.data));
    // httpClient.get("/equipamento").then((response) => setEquipamentos(response.data));
  }, []);

  const adicionarItemLocacao = () => {
    const equipamentoId = formRef.current.querySelector('input[name="equipamentoId"]').value;
    const quantidade = formRef.current.querySelector('input[name="quantidade"]').value;
    const valorUnitario = formRef.current.querySelector('input[name="valorUnitario"]').value;

    setItensLocacao([...itensLocacao, { equipamentoId, quantidade, valorUnitario }]);
  };

  const cadastrarLocacao = () => {
    const formElement = formRef.current;
    const formData = new FormData(formElement);
    alertMsg.current.style.display = 'none';

    const dados = {
      locDataInicio: formData.get('locDataInicio'),
      locDataFinalPrevista: formData.get('locDataFinalPrevista'),
      locDataFinalEntrega: formData.get('locDataFinalEntrega'),
      locValorTotal: formData.get('locValorTotal'),
      locDesconto: formData.get('locDesconto'),
      locValorFinal: formData.get('locValorFinal'),
      locCliId: formData.get('locCliId'),
      locUsuId: formData.get('locUsuId'),
      locStatus: formData.get('locStatus'),
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
          formElement.reset();
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
        <div className="input-group">
          <label>Data de Início</label>
          <input type="date" name="locDataInicio" required />
        </div>

        <div className="input-group">
          <label>Data Final Prevista</label>
          <input type="date" name="locDataFinalPrevista" required />
        </div>

        <div className="input-group">
          <label>Data Final de Entrega</label>
          <input type="date" name="locDataFinalEntrega" required />
        </div>

        <div className="input-group">
          <label>Valor Total</label>
          <input type="number" name="locValorTotal" required />
        </div>

        <div className="input-group">
          <label>Desconto</label>
          <input type="number" name="locDesconto" />
        </div>

        <div className="input-group">
          <label>Valor Final</label>
          <input type="number" name="locValorFinal" required />
        </div>

        <div className="input-group">
          <label>Cliente</label>
          <input list="clientes" name="locCliId" required />
          <datalist id="clientes">
            {clientes.map(cliente => (
              <option key={cliente.cliId} value={cliente.cliId}>
                {cliente.cliNome}
              </option>
            ))}
          </datalist>
        </div>

        <div className="input-group">
          <label>Usuário (Funcionário)</label>
          <input list="usuarios" name="locUsuId" required />
          <datalist id="usuarios">
            {usuarios.map(usuario => (
              <option key={usuario.usuId} value={usuario.usuId}>
                {usuario.usuNome}
              </option>
            ))}
          </datalist>
        </div>

        <div className="input-group">
          <label>Status da Locação</label>
          <select name="locStatus" required>
            <option value="1">Em andamento</option>
            <option value="2">Encerrada</option>
          </select>
        </div>

        <hr />

        <h3>Itens da Locação</h3>

        <div className="input-group">
          <label>Equipamento</label>
          <input list="equipamentos" name="equipamentoId" />
          <datalist id="equipamentos">
            {equipamentos.map(equipamento => (
              <option key={equipamento.id} value={equipamento.id}>
                {equipamento.nome}
              </option>
            ))}
          </datalist>
        </div>

        <div className="input-group">
          <label>Quantidade</label>
          <input type="number" name="quantidade" />
        </div>

        <div className="input-group">
          <label>Valor Unitário</label>
          <input type="number" name="valorUnitario" />
        </div>

        <button type="button" onClick={adicionarItemLocacao}>Adicionar Item</button>

        <div className="container-btn">
          <CriarBotao value='Voltar' href='/locacao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={cadastrarLocacao}>Cadastrar Locação</button>
        </div>
      </form>
    </section>
  );
}