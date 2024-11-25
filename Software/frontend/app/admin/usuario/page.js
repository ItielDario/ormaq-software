'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Usuario() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarUsuarios();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarUsuarios() {
        httpClient.get("/usuario")
        .then(r => r.json())
        .then((r) => {
            console.log(r);
            setListaUsuarios(r);
        });
    }

    function excluirUsuario(idUsuario) {
        if (confirm("Tem certeza que deseja excluir esse usuário?")) {
            let status = 0;

            httpClient.delete(`/usuario/${idUsuario}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status === 200) {
                    carregarUsuarios();
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

    function imprimirRelatorioUsuarios() {
        const tabela = document.getElementById("tabela-usuarios");
        if (!tabela) {
            alert("Nenhuma tabela disponível para impressão.");
            return;
        }

        const tabelaClone = tabela.cloneNode(true);
        tabelaClone.querySelectorAll("thead tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(4); // Remove coluna "Ações"
        });
        tabelaClone.querySelectorAll("tbody tr").forEach((tr) => {
            tr.deleteCell(0); // Remove coluna "Info"
            tr.deleteCell(4); // Remove coluna "Ações"
        });

        const htmlImpressao = `
            <html>
            <head>
                <title>Relatório de Usuários</title>
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
                <h1>Relatório de Usuários</h1>
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
                <h1>Lista de Usuários</h1>
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioUsuarios}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/usuario/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-usuarios" className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaUsuarios.map(usuario => (
                            <tr key={usuario.usuId}>
                                <td>{usuario.usuId}</td>
                                <td>{usuario.usuNome}</td>
                                <td>{usuario.usuEmail}</td>
                                <td>{usuario.usuTelefone || 'Sem Telefone'}</td>
                                <td>{usuario.usuPerDescricao}</td>
                                <td>
                                    <a href={`/admin/usuario/alterar/${usuario.usuId}`}>
                                        <i className="nav-icon fas fa-pen"></i>
                                    </a>
                                    <a onClick={() => excluirUsuario(usuario.usuId)}>
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