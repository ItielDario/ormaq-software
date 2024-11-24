'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Cliente() {
    const [listaClientes, setListaClientes] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarClientes();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarClientes() {
        httpClient.get("/cliente")
            .then(r => r.json())
            .then((r) => {
                setListaClientes(r);
            });
    }

    function excluirCliente(idCliente) {
        if (confirm("Tem certeza que deseja excluir esse cliente?")) {
            let status = 0;

            httpClient.delete(`/cliente/${idCliente}`)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    if (status === 200) {
                        carregarClientes();
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

    function imprimirRelatorioClientes() {
        const tabela = document.getElementById("tabela-clientes");
        if (!tabela) {
            alert("Nenhuma tabela disponível para impressão.");
            return;
        }
    
        // Clona a tabela para impressão
        const tabelaClone = tabela.cloneNode(true);
    
        // Remove a coluna de ações
        tabelaClone.querySelectorAll("thead tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(4); // Remove coluna "Ações"
        });
        tabelaClone.querySelectorAll("tbody tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(4); // Remove coluna "Ações"
        });
    
        // Criar o conteúdo HTML para impressão
        const htmlImpressao = `
            <html>
            <head>
                <title>Relatório de Clientes</title>
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
                <h1>Relatório de Clientes</h1>
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
                <h1>Lista de Clientes</h1>
                
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioClientes}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/cliente/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-clientes" className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaClientes.map(cliente => (
                            <tr key={cliente.cliId}>
                                <td>{cliente.cliId}</td>
                                <td>{cliente.cliNome}</td>
                                <td>{cliente.cliCPF_CNPJ}</td>
                                <td>{cliente.cliTelefone || "Sem Telefone"}</td>
                                <td>{cliente.cliEmail || "Sem Email"}</td>
                                <td>
                                    <a href={`/admin/cliente/alterar/${cliente.cliId}`}><i className="nav-icon fas fa-pen"></i></a>
                                    <a onClick={() => excluirCliente(cliente.cliId)}><i className="nav-icon fas fa-trash"></i></a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
        </section>
    );
}