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
                locacao.locDataFinalEntrega = locacao.locDataFinalEntrega ? new Date(locacao.locDataFinalEntrega).toLocaleDateString() : "Não entregue";
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

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Locações</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/locacao/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Info</th>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>CPF/CNPJ</th>
                            <th>Data de Início</th>
                            <th>Data Final Prevista</th>
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
                                        <a href={`/locacao/informacao/${locacao.locId}`}><i className="nav-icon fas fa-info-circle"></i></a>
                                    </div>
                                </td>
                                <td>{locacao.locId}</td>
                                <td>{locacao.cliNome}</td>
                                <td>{locacao.cliCPF_CNPJ}</td>
                                <td>{locacao.locDataInicio}</td>
                                <td>{locacao.locDataFinalPrevista}</td>
                                <td>R$ {locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A'}</td>
                                <td>{locacao.locStaDescricao}</td>
                                <td>
                                    <div>
                                        <a href={`/locacao/finalizar/${locacao.locId}`}><i className="nav-icon fas fa-clipboard-check"></i></a>
                                        <a href={`/locacao/alterar/${locacao.locId}`}><i className="nav-icon fas fa-pen"></i></a>
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