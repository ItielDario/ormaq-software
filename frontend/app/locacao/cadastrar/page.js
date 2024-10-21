'use client';
import { useRef, useState, useEffect } from "react";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { Table } from "ckeditor5";

export default function CadastrarLocacao() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [itensLocacao, setItensLocacao] = useState([]);

  useEffect(() => {
    // httpClient.get("/cliente").then((response) => setClientes(response.data));
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
        <section>
          <label>Cliente (CPF / CNPJ / Nome)</label>
          <input list="clientes" name="locCliId" className="datalist" required/>
          <datalist id="clientes">
            {clientes.map(cliente => (
              <option key={cliente.cliId} value={cliente.cliId}>
                {cliente.cliNome}
              </option>
            ))}
          </datalist>
        </section>

        <section className="input-group">
          <section>
            <label>Data de início da locação</label>
            <input type="date" name="locDataInicio" required />
          </section>

          <section>
            <label>Data de termino da locação</label>
            <input type="date" name="locDataFinalPrevista" required />
          </section>
        </section>

        <section className="itens-locacao">
          <article className="itens-locacao-header">
            <p>Itens da Locação</p>
            <button type="button" className='btn-add' onClick={adicionarItemLocacao}>Adicionar Item</button>
          </article>
                    
          <section className="input-group">
            <section className="input-equipamento">
              <label>Equipamento</label>
              <input list="equipamentos" name="equipamentoId" className="datalist" />
              <datalist id="equipamentos">
                {equipamentos.map(equipamento => (
                  <option key={equipamento.id} value={equipamento.id}>
                    {equipamento.nome}
                  </option>
                ))}
              </datalist>
            </section>

            <section className="input-quantidade">
              <label>Quantidade</label>
              <input type="number" name="quantidade" />
            </section>
          </section>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Data de Aquisição</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            
            <tbody>
              
            </tbody>
          </table>

          <article className="itens-locacao-footer">
            <strong>Valor total: </strong>
            <strong className="valor-total-box">R$ 1000,00</strong>
          </article>
        </section>

        <section>
          <label>Desconto</label>
          <input type="number" name="locDesconto" />
        </section>

        <section className="container-btn">
          <CriarBotao value='Voltar' href='/locacao' class='btn-voltar'></CriarBotao>
          <button type="button" className='btn-cadastrar' onClick={cadastrarLocacao}>Cadastrar Locação</button>
        </section>
      </form>
    </section>
  );
}