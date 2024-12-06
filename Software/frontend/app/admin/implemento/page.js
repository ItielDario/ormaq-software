'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Implemento() {
    const [listaImplementos, setListaImplementos] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarImplementos();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarImplementos() {
        httpClient.get("/implemento")
            .then(r => r.json())
            .then((r) => {
                r.map(implemento => implemento.impDataAquisicao = new Date(implemento.impDataAquisicao).toLocaleDateString()) // Formatando a data
                setListaImplementos(r);
            });
    }

    function excluirImplemento(idImplemento) {
        if (confirm("Tem certeza que deseja excluir esse implemento?")) {
            let status = 0;

            httpClient.delete(`/implemento/${idImplemento}`)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    if (status === 200) {
                        carregarImplementos();
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

    function imprimirRelatorioImplementos() {
        const tabela = document.getElementById("tabela-implementos");
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
                <title>Relatório de Implementos</title>
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
                <h1>Relatório de Implementos</h1>
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

    function alternarExibicaoClassificados(idImplemento, statusAtual) {
        alertMsg.current.style.display = 'none';
        const novoStatus = statusAtual === 1 ? 0 : 1; // Alterna entre 1 (exibir) e 0 (não exibir)
        let status = 0;
    
        httpClient.put(`/implemento/exibir/${idImplemento}`, { impExibirCatalogo: novoStatus })
        .then(r => { 
            status = r.status;
            return r.json();
        })
        .then(r => {
            timeoutId = setTimeout(() => {
                if (status === 200) {
                    carregarImplementos(); 
                    alertMsg.current.className = 'alertSuccess';
                } else {
                    alertMsg.current.className = 'alertError';
                }

                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;
            }, 100);

            document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
        })
        .catch((ex) => {
            console.log(ex)
            alertMsg.current.className = 'alertError';
            alertMsg.current.style.display = 'block';
            alertMsg.current.textContent = 'Erro ao alterar exibição nos classificados.';
        });
    } 
    
    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Implementos</h1>
                <a href={`/admin/implemento/ajuda`}><i className="nav-icon fas fa-question-circle"></i></a>
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioImplementos}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/implemento/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-implementos" className="table">
                    <thead>
                        <tr>
                            <th>Exibir</th>
                            <th>Nome</th>
                            <th>Data de Aquisição</th>
                            <th>Preço Venda</th>
                            <th>Preço / Hora</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaImplementos.map(implemento => (
                            <tr key={implemento.impId}>
                                <td>
                                    <a onClick={() => alternarExibicaoClassificados(implemento.impId, implemento.impExibirCatalogo)}>
                                        <i className={implemento.impExibirCatalogo === 1 ? "nav-icon fas fa-eye" : "nav-icon fas fa-eye-slash"}></i>
                                    </a>
                                </td>
                                <td>{implemento.impNome}</td>
                                <td>{implemento.impDataAquisicao}</td>
                                <td>R$ {implemento.impPrecoVenda}</td>
                                <td>R$ {implemento.impPrecoHora}</td>
                                <td>{implemento.equipamentoStatus.equipamentoStatusDescricao}</td>
                                <td>
                                    <div className="btn-acoes">
                                        <a href={`/admin/implemento/alterar/${implemento.impId}`}><i className="nav-icon fas fa-pen"></i></a>
                                        <a onClick={() => excluirImplemento(implemento.impId)}><i className="nav-icon fas fa-trash"></i></a>
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