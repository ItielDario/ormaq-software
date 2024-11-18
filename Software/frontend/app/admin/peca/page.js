'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Peca() {
    const [listaPecas, setListaPecas] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarPecas();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarPecas() {
        httpClient.get("/peca")
            .then(r => r.json())
            .then((r) => {
                r.map(peca => peca.pecaDataAquisicao = new Date(peca.pecaDataAquisicao).toLocaleDateString()) // Formatando a data
                setListaPecas(r);
            });
    }

    function excluirPeca(idPeca) {
        if (confirm("Tem certeza que deseja excluir essa peça?")) {
            let status = 0;

            httpClient.delete(`/peca/${idPeca}`)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    if (status === 200) {
                        carregarPecas();
                        alertMsg.current.className = 'alertSuccess';
                    } else {
                        alertMsg.current.className = 'alertError';
                    }

                    alertMsg.current.style.display = 'block';
                    alertMsg.current.textContent = r.msg;

                    // Inicia o setTimeout e armazena o ID
                    timeoutId = setTimeout(() => {
                        if (alertMsg.current) {
                            alertMsg.current.style.display = 'none';
                        }
                    }, 6000);
                    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
                });
        }
    }

    function imprimirRelatorioPecas() {
        const tabela = document.getElementById("tabela-pecas");
        if (!tabela) {
            alert("Nenhuma tabela disponível para impressão.");
            return;
        }

        // Clona a tabela para impressão
        const tabelaClone = tabela.cloneNode(true);

        // Remove a coluna de ações
        tabelaClone.querySelectorAll("thead tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(5); // Remove coluna "Ações"
        });
        tabelaClone.querySelectorAll("tbody tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(5); // Remove coluna "Ações"
        });

        // Criar o conteúdo HTML para impressão
        const htmlImpressao = `
            <html>
            <head>
                <title>Relatório de Peças</title>
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
                <h1>Relatório de Peças</h1>
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
                <h1>Lista de Peças</h1>
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioPecas}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/peca/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-pecas" className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data de Aquisição</th>
                            <th>Preço Venda</th>
                            <th>Preço / Hora</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaPecas.map(peca => (
                            <tr key={peca.pecaId}>
                                <td>{peca.pecaId}</td>
                                <td>{peca.pecaNome}</td>
                                <td>{peca.pecaDataAquisicao}</td>
                                <td>R$ {peca.pecaPrecoVenda}</td>
                                <td>R$ {peca.pecaPrecoHora}</td>
                                <td>{peca.equipamentoStatus.equipamentoStatusDescricao}</td>
                                <td>
                                    <a href={`/admin/peca/alterar/${peca.pecaId}`}>
                                        <i className="nav-icon fas fa-pen"></i>
                                    </a>
                                    <a onClick={() => excluirPeca(peca.pecaId)}>
                                        <i className="nav-icon fas fa-trash"></i>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
        </section>
    );
}