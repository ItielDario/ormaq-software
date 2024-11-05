'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Manutencao() {
    const [listaManutencoes, setListaManutencoes] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarManutencoes();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarManutencoes() {
        httpClient.get("/manutencao")
            .then(r => r.json())
            .then((r) => {
                r.map(manutencao => {
                    manutencao.manDataInicio = new Date(manutencao.manDataInicio).toLocaleDateString();
                    manutencao.manDataTermino = manutencao.manDataTermino ? new Date(manutencao.manDataTermino).toLocaleDateString() : "Aguardando finalização";
                });
                setListaManutencoes(r);
            })
    }

    function excluirManutencao(idManutencao) {
        if (confirm("Tem certeza que deseja excluir essa manutenção?")) {
            let status = 0;

            httpClient.delete(`/manutencao/${idManutencao}`)
                .then(r => {
                    status = r.status;
                    return r.json();
                })
                .then(r => {
                    if (status == 200) {
                        carregarManutencoes();
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
                <h1>Lista de Manutenções</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/manutencao/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome do Equipamento', 'Tipo do Equipamento', 'Data de Início', 'Data de Término', 'Status', 'Ações']}
                    listaDados={listaManutencoes.map(manutencao => ({
                        id: manutencao.manId,
                        Descrição: manutencao.manEqpNome,
                        Tipo: manutencao.maqEqpTipo,
                        'Data de Início': manutencao.manDataInicio,
                        'Data de Término': manutencao.manDataTermino,
                        Status: manutencao.manStatus
                    }))}
                    renderActions={(manutencao) => (
                        <div>
                            <a href={`/manutencao/alterar/${manutencao.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirManutencao(manutencao.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}