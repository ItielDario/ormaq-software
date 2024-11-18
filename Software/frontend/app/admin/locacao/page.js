'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Locacao() {
    const [listaLocacoes, setListaLocacoes] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarLocacoes();
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarLocacoes() {
        httpClient.get("/locacao")
        .then(r => r.json())
        .then((r) => {
            r.map(locacao => {
                locacao.locDataInicio = new Date(locacao.locDataInicio).toLocaleDateString();
                locacao.locDataFinalPrevista = new Date(locacao.locDataFinalPrevista).toLocaleDateString();
                locacao.locDataFinalEntrega = locacao.locDataFinalEntrega ? new Date(locacao.locDataFinalEntrega).toLocaleDateString() : " -";
            });
            setListaLocacoes(r);
        });
    }

    function excluirLocacao(idLocacao) {
        if (confirm("Tem certeza que deseja excluir essa locação?")) {
            let status = 0;
            httpClient.delete(`/locacao/${idLocacao}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status == 200) {
                    carregarLocacoes();
                    alertMsg.current.className = 'alertSuccess';
                } else {
                    alertMsg.current.className = 'alertError';
                }
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

                timeoutId = setTimeout(() => {
                    if (alertMsg.current) {
                        alertMsg.current.style.display = 'none';
                    }
                }, 6000);
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
            });
        }
    }

    function imprimirRelatorioLocacao() {
        const tabela = document.getElementById("tabela-locacao");
        if (!tabela) {
            alert("Nenhuma tabela disponível para impressão.");
            return;
        }

        const tabelaClone = tabela.cloneNode(true);
        tabelaClone.querySelectorAll("thead tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(6); // Remove coluna "Ações"
        });
        tabelaClone.querySelectorAll("tbody tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(6); // Remove coluna "Ações"
        });

        const htmlImpressao = `
            <html>
            <head>
                <title>Relatório de Máquinas</title>
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
                <h1>Relatório de Locações</h1>
                <table>
                    ${tabelaClone.innerHTML}
                </table>
            </body>
            </html>
        `;

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
            document.body.removeChild(iframe);
        };
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Locações</h1>
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioLocacao}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/locacao/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-locacao" className="table">
                    <thead>
                        <tr>
                            <th>Info</th>
                            <th>Cliente</th>
                            <th>CPF/CNPJ</th>
                            <th>Data de Início</th>
                            <th>Data de Entrega</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaLocacoes.map(locacao => (
                            <tr key={locacao.locId}>
                                <td>
                                    <div>
                                        <a href={`/admin/locacao/informacao/${locacao.locId}`}><i className="nav-icon fas fa-info-circle"></i></a>
                                    </div>
                                </td>
                                <td>{locacao.cliNome}</td>
                                <td>{locacao.cliCPF_CNPJ}</td>
                                <td>{locacao.locDataInicio}</td>
                                <td>{locacao.locDataFinalEntrega}</td>
                                <td>R$ {locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A'}</td>
                                <td>{locacao.locStaDescricao}</td>
                                <td>
                                    <div className="btn-acoes">
                                        {locacao.locStaDescricao !== 'Finalizada' && (
                                            <div>
                                                <a href={`/admin/locacao/finalizar/${locacao.locId}`}><i className="nav-icon fas fa-clipboard-check"></i></a>
                                                <a href={`/admin/locacao/alterar/${locacao.locId}`}><i className="nav-icon fas fa-pen"></i></a>
                                            </div>
                                        )}
                                        <a onClick={() => excluirLocacao(locacao.locId)}><i className="nav-icon fas fa-trash"></i></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
        </section>
    );
}