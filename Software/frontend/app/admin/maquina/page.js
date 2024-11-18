'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Maquina() {
    const [listaMaquinas, setListaMaquinas] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarMaquinas();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarMaquinas() {
        httpClient.get("/maquina")
            .then(r => r.json())
            .then((r) => {
                console.log(r)
                r.map(maquina => maquina.maqDataAquisicao = new Date(maquina.maqDataAquisicao).toLocaleDateString());
                setListaMaquinas(r);
            });
    }

    function excluirMaquina(idMaquina) {
        if (confirm("Tem certeza que deseja excluir essa máquina?")) {
            let status = 0;

            httpClient.delete(`/maquina/${idMaquina}`)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    if (status === 200) {
                        carregarMaquinas();
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

    function imprimirRelatorioMaquinas() {
        const tabela = document.getElementById("tabela-maquinas");
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
                        padding: 0.5vw;
                        text-align: left;
                        font-size: 1.7vw;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Relatório de Máquinas</h1>
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
                <h1>Lista de Máquinas</h1>
            </article>

            <article className="container-btn-cadastrar">
                <button className="btn-imprimir" onClick={imprimirRelatorioMaquinas}>Imprimir Relatório</button>
                <CriarBotao value='Cadastrar' href='/admin/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table id="tabela-maquinas" className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Modelo</th>
                            <th>Série/Chassi</th>
                            <th>Tipo</th>
                            <th>Horas de Uso</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaMaquinas.map(maquina => (
                            <tr key={maquina.maqId}>
                                <td>{maquina.maqId}</td>
                                <td>{maquina.maqNome}</td>
                                <td>{maquina.maqModelo}</td>
                                <td>{maquina.maqSerie}</td>
                                <td>{maquina.maqTipo}</td>
                                <td>{maquina.maqHorasUso}</td>
                                <td>{maquina.equipamentoStatus.equipamentoStatusDescricao}</td>
                                <td>
                                    <a href={`/admin/maquina/alterar/${maquina.maqId}`}>
                                        <i className="nav-icon fas fa-pen"></i>
                                    </a>
                                    <a onClick={() => excluirMaquina(maquina.maqId)}>
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