'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function InfoLocacao({ params: { id } }) {
    const [locacao, setLocacao] = useState(null);
    const [itensLocacao, setItensLocacao] = useState([]);

    useEffect(() => {
        if (id) {
          httpClient.get(`/locacao/${id}`)
          .then(r => r.json())
          .then(data => {
            if (data.locacao) {
              data.locacao.locDataInicio = new Date(data.locacao.locDataInicio).toLocaleDateString();
              data.locacao.locDataFinalPrevista = new Date(data.locacao.locDataFinalPrevista).toLocaleDateString();
              data.locacao.locDataFinalEntrega = data.locacao.locDataFinalEntrega 
                ? new Date(data.locacao.locDataFinalEntrega).toLocaleDateString() 
                : "Não entregue";
              setLocacao(data.locacao);
          }
            setItensLocacao(data.itensLocacao || []);
          })
          .catch(error => console.error("Erro ao buscar locação:", error));
        }
    }, []);

    if (!locacao) {
      return <p>Carregando informações da locação...</p>;
    }

    return (
      <section className="content-main-children-listar">
          <article className="title">
              <h1>Informações da Locação</h1>
          </article>

          <article className="container-info">
              <h2 className="title-info">Dados da Locação</h2>
              <p className="data-info"><strong>Data de Início:</strong> {locacao.locDataInicio}</p>
              <p className="data-info"><strong>Data de Entrega Esperada:</strong> {locacao.locDataFinalPrevista}</p>
              <p className="data-info"><strong>Data de Entrega Realizada:</strong> {locacao.locDataFinalEntrega}</p>
              <p className="data-info"><strong>Valor Final:</strong> R$ {locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A'}</p>
              <p className="data-info"><strong>Desconto:</strong> R$ {locacao.locDesconto ? parseFloat(locacao.locDesconto).toFixed(2) : '0,00'}</p>
              <p className="data-info data-info-ultimo"><strong>Status:</strong> {locacao.locStaDescricao}</p>
          </article>

          <article className="container-table">
              <h2 style={{ marginBottom: '0.6vw' }}>Itens da Locação</h2>
              {itensLocacao.length > 0 ? (
                  <table className="table">
                      <thead>
                          <tr>
                              <th>Nome do Equipamento</th>
                              <th>Tipo do Equipamento</th>
                              <th>Quantidade</th>
                              <th>Valor Unitário</th>
                          </tr>
                      </thead>
                      <tbody>
                          {itensLocacao.map((item, index) => (
                              <tr key={index}>
                                  <td>{item.iteLocNome}</td>
                                  <td>{item.iteLocTipo}</td>
                                  <td>{item.iteLocQuantidade}</td>
                                  <td>R$ {parseFloat(item.iteLocValorUnitario).toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              ) : (
                  <p>Nenhum item associado a esta locação.</p>
              )}
          </article>

          <article className="container-info">
              <h2 className="title-info">Dados do Cliente</h2>
              <p className="data-info"><strong>Nome:</strong> {locacao.cliNome}</p>
              <p className="data-info"><strong>CPF/CNPJ:</strong> {locacao.cliCPF_CNPJ}</p>
              <p className="data-info"><strong>Email:</strong> {locacao.cliEmail || "Email não cadastrado"}</p>
              <p className="data-info data-info-ultimo"><strong>Telefone:</strong> {locacao.cliTelefone || "Telefone não cadastrado"}</p>
          </article>

          <div className="container-btn-cadastrar">
              <CriarBotao value='Voltar' href='/admin/locacao' class='btn-voltar' />
          </div>
      </section>
  );
}