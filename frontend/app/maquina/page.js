'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Maquina() {
    const [listaMaquinas, setListaMaquinas] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarMaquinas();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarMaquinas() {
        httpClient.get("/maquina")
        .then(r => r.json())
        .then((r) => {
            r.map(maquina => maquina.maqDataAquisicao = new Date(maquina.maqDataAquisicao).toLocaleDateString()) // Formatando a data
            setListaMaquinas(r)
        })
    }

    function excluirMaquina(idMaquina) {
        if(confirm("Tem certeza que deseja excluir essa máquina?")) {
            let status = 0;

            httpClient.delete(`/maquina/${idMaquina}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if(status == 200) {
                    carregarMaquinas();
                    alertMsg.current.className = 'alertSuccess';
                }
                else {
                    alertMsg.current.className = 'alertError';
                }

                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

                // Inicia o setTimeout e armazena o ID
                timeoutId = setTimeout(() => {
                    if (alertMsg.current) { // Verifica se alertMsg ainda existe
                        alertMsg.current.style.display = 'none';
                    }
                }, 6000);
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
            })
        }
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Máquinas</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status', 'Ações']}
                    listaDados={listaMaquinas.map(maquina => ({
                        id: maquina.maqId,
                        Nome: maquina.maqNome,
                        'Data de Aquisição': maquina.maqDataAquisicao,
                        Tipo: maquina.maqTipo,
                        'Horas de Uso': maquina.maqHorasUso,
                        Status: maquina.equipamentoStatus.equipamentoStatusDescricao
                    }))}
                    renderActions={(maquina) => (
                        <div>
                            <a href={`/maquina/alterar/${maquina.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirMaquina(maquina.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}