'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

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
                setListaImplementos(r)
            })
    }

    function excluirImplemento(idImplemento) {
        if(confirm("Tem certeza que deseja excluir esse implemento?")) {
            let status = 0;

            httpClient.delete(`/implemento/${idImplemento}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if(status == 200) {
                    carregarImplementos();
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
                <h1>Lista de Implementos</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/implemento/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Preço Venda', 'Preço / Hora', 'Status', 'Ações']}
                    listaDados={listaImplementos.map(implemento => ({
                        id: implemento.impId,
                        Nome: implemento.impNome,
                        'Data de Aquisição': implemento.impDataAquisicao,
                        'Preço Venda': `R$ ${implemento.impPrecoVenda}`,
                        'Preço / Hora': `R$ ${implemento.impPrecoHora}`,
                        Status: implemento.equipamentoStatus.equipamentoStatusDescricao
                    }))}
                    renderActions={(implemento) => (
                        <div>
                            <a href={`/implemento/alterar/${implemento.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirImplemento(implemento.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}