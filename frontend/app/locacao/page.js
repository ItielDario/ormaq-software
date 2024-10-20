'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Locacao() {
    const [listaLocacoes, setListaLocacoes] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarLocacoes();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarLocacoes() {
        httpClient.get("/locacao")
        .then(r => r.json())
        .then((r) => {
          console.log(r)
            r.map(locacao => {
                locacao.locDataInicio = new Date(locacao.locDataInicio).toLocaleDateString();
                locacao.locDataFinalPrevista = new Date(locacao.locDataFinalPrevista).toLocaleDateString();
                locacao.locDataFinalEntrega = locacao.locDataFinalEntrega ? new Date(locacao.locDataFinalEntrega).toLocaleDateString() : "Não entregue"; // Formatando a data ou "Não entregue"
            });
            setListaLocacoes(r);
        })
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
                <MontarTabela
                    cabecalhos={['ID', 'Cliente', 'Data de Início', 'Data Final Prevista', 'Data de Entrega', 'Valor Total', 'Status', 'Ações']}
                    listaDados={listaLocacoes.map(locacao => ({
                      id: locacao.locId,
                      Cliente: locacao.cliNome,
                      'Data de Início': locacao.locDataInicio,
                      'Data Final Prevista': locacao.locDataFinalPrevista,
                      'Data de Entrega': locacao.locDataFinalEntrega,
                      'Valor Total': locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A',
                      Status: locacao.locStaDescricao
                    }))}                  
                    renderActions={(locacao) => (
                        <div>
                            <a href={`/locacao/alterar/${locacao.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirLocacao(locacao.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}
