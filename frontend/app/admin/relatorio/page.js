'use client';

import { useState, useEffect } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Relatorios() {
  const [abaAtiva, setAbaAtiva] = useState("locacoes");
  const [filtro, setFiltro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [listaLocacoes, setListaLocacoes] = useState([]);
  const [listaManutencoes, setListaManutencoes] = useState([]);
  const [isMounted, setIsMounted] = useState(false); // Controle de montagem

  useEffect(() => {
    setIsMounted(true); // Marca que o componente está montado no cliente
    carregarLocacoes();
    carregarManutencoes();
  }, []);

  function carregarLocacoes() {
    httpClient
      .get("/locacao")
      .then((r) => r.json())
      .then((r) => {
        const locacoes = r.map((locacao) => ({
          ...locacao,
          locDataInicio: new Date(locacao.locDataInicio).toLocaleDateString(),
          locDataFinalPrevista: new Date(locacao.locDataFinalPrevista).toLocaleDateString(),
          locDataFinalEntrega: locacao.locDataFinalEntrega
            ? new Date(locacao.locDataFinalEntrega).toLocaleDateString()
            : " -",
        }));
        setListaLocacoes(locacoes);
      })
      .catch((err) => console.error("Erro ao carregar locações:", err));
  }

  function carregarManutencoes() {
    httpClient
      .get("/manutencao")
      .then((r) => r.json())
      .then((r) => {
        const manutencoes = r.map((manutencao) => ({
          ...manutencao,
          manDataInicio: new Date(manutencao.manDataInicio).toLocaleDateString(),
          manDataTermino: manutencao.manDataTermino
            ? new Date(manutencao.manDataTermino).toLocaleDateString()
            : " -",
        }));
        setListaManutencoes(manutencoes);
      })
      .catch((err) => console.error("Erro ao carregar manutenções:", err));
  }

  if (!isMounted) {
    return null; // Evita renderizar durante o SSR
  }

  function filtrarItens(lista) { 

    const formatarData = (dataString) => { // Função para formatar a data em no padra mes-dia-ano
      if (!dataString) return null;
      const partes = dataString.includes("/") ? dataString.split("/") : dataString.split("-");
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    };

    const dataInicioValida = dataInicio ? new Date(dataInicio) : null;
    const dataFinalValida = dataFinal ? new Date(dataFinal) : null;
    let dataFinalItem = null

    return lista.filter((item) => { // Retorna um array de itens filtrados
      const dataInicioItem = formatarData(
        abaAtiva === "locacoes" ? item.locDataInicio : item.manDataInicio
      );

      if(abaAtiva === "locacoes"){
        if(item.locDataFinalEntrega){ dataFinalItem = formatarData(item.locDataFinalEntrega) }
        else{ dataFinalItem = null }
      }
      else{ dataFinalItem = formatarData(item.manDataTermino) }

      // Valida a busca
      const filtroValido = filtro
        ? Object.values(item).some((val) =>
            String(val).toLowerCase().includes(filtro.toLowerCase())
          )
        : true;

      // Valida a data de inicio
      const dataInicioValidaFiltro = dataInicioValida
        ? dataInicioItem && dataInicioItem >= dataInicioValida
        : true;

      // Valida a data de término
      const dataFinalValidaFiltro = dataFinalValida
        ? dataFinalItem ? dataFinalItem <= dataFinalValida : true
        : true;

      return filtroValido && dataInicioValidaFiltro && dataFinalValidaFiltro;
    });
  }

  function limparFormulario() {
    setFiltro("");
    setDataInicio("");
    setDataFinal("");
  }

  function imprimirRelatorio() {
    const isLocacoes = abaAtiva === "locacoes";
    const tabelaId = isLocacoes ? "tabela-locacoes" : "tabela-manutencoes";
    const tabela = document.getElementById(tabelaId);

    if (!tabela) {
        alert("Nenhuma tabela disponível para impressão.");
        return;
    }

    // Clona a tabela para remover a coluna "Info"
    const tabelaClone = tabela.cloneNode(true);

    // Remover a primeira coluna (Info) de cabeçalho e dados
    tabelaClone.querySelectorAll("thead tr").forEach((tr) => tr.deleteCell(0));
    tabelaClone.querySelectorAll("tbody tr").forEach((tr) => tr.deleteCell(0));

    const titulo = isLocacoes ? "Relatório de Locações" : "Relatório de Manutenções";

    // Criar o conteúdo HTML para impressão
    const htmlImpressao = `
        <html>
        <head>
            <title>${titulo}</title>
            <style>
                body {
                    font-family: "Roboto", sans-serif;
                    margin: 2vw;
                }
                h1 {
                    text-align: center;
                    font-size: 4vw;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 2vw;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 0.6vw;
                    text-align: left;
                    font-size: 2vw;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>${titulo}</h1>
            <table>
                ${tabelaClone.innerHTML}
            </table>
        </body>
        </html>
    `;

    // Criar um iframe oculto para impressão
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlImpressao);
    doc.close();

    iframe.onload = () => {
        iframe.contentWindow.print();
        document.body.removeChild(iframe); // Remover o iframe após a impressão
    };
  }

  return (
    <section className="content-main-children-listar">
      <article className="title">
        <h1>Relatórios</h1>

        <article className="box-btn-limpar">
          <button className="btn-imprimir" onClick={imprimirRelatorio}>Imprimir Relatório</button>
        </article>
      </article>

      <section className="tabs">
        <article className={`box-type ${abaAtiva === "locacoes" ? "active" : ""}`} onClick={() => setAbaAtiva("locacoes")}>
          <p>Locações</p>
        </article>
        <article className={`box-type ${abaAtiva === "manutencoes" ? "active" : ""}`} onClick={() => setAbaAtiva("manutencoes")}>
          <p> Manutenções</p>
        </article>
      </section>

      <article className="search-bar">
        <section>
          <label>{abaAtiva === "locacoes" ? "Buscar Locações" : "Buscar Manutenções"}</label>
          <input type="text" placeholder={abaAtiva === "locacoes" ? "Digite o nome do cliente" : "Digite o nome do equipamento"} value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </section>
        <section>
          <label>Data de início</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </section>
        <section>
          <label>Data de término</label>
          <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
        </section>
      </article>

      <article className="box-btn-limpar">
        <button className="btn-limpar" onClick={limparFormulario}>Limpar Filtros</button>
      </article>

      {abaAtiva === "locacoes" && (
        <article className="container-table">
          <table id="tabela-locacoes" className="table">
          {abaAtiva === "locacoes" && (
            <article className="container-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Info</th>
                    <th>Cliente</th>
                    <th>CPF/CNPJ</th>
                    <th>Data de Início</th>
                    <th>Data de Entrega</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarItens(listaLocacoes).length > 0 ? (
                    filtrarItens(listaLocacoes).map((locacao) => (
                      <tr key={locacao.locId}>
                        <td>
                          <a href={`/admin/locacao/informacao/${locacao.locId}`}>
                            <i className="nav-icon fas fa-info-circle"></i>
                          </a>
                        </td>
                        <td>{locacao.cliNome}</td>
                        <td>{locacao.cliCPF_CNPJ}</td>
                        <td>{locacao.locDataInicio}</td>
                        <td>{locacao.locDataFinalEntrega}</td>
                        <td>R$ {locacao.locValorFinal}</td>
                        <td>{locacao.locStaDescricao}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">Nenhuma locação encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </article>
          )}
          </table>
        </article>
      )}

      {abaAtiva === "manutencoes" && (
        <article className="container-table">
          <table id="tabela-manutencoes" className="table">
          {abaAtiva === "manutencoes" && (
            <article className="container-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Info</th>
                    <th>Nome do Equipamento</th>
                    <th>Tipo do Equipamento</th>
                    <th>Data de Início</th>
                    <th>Data de Término</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarItens(listaManutencoes).length > 0 ? (
                    filtrarItens(listaManutencoes).map((manutencao) => (
                      <tr key={manutencao.manId}>
                        <td>
                          <a href={`/admin/manutencao/informacao/${manutencao.manId}`}>
                            <i className="nav-icon fas fa-info-circle"></i>
                          </a>
                        </td>
                        <td>{manutencao.manEqpNome}</td>
                        <td>{manutencao.maqEqpTipo}</td>
                        <td>{manutencao.manDataInicio}</td>
                        <td>{manutencao.manDataTermino}</td>
                        <td>{manutencao.manStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">Nenhuma manutenção encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </article>
          )}
          </table>
        </article>
      )}
    </section>
  );
}