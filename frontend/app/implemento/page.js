'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Implemento() {
    const [listaImplementos, setListaImplementos] = useState([]);

    useEffect(() => {
        carregarImplementos();
    }, []);

    function carregarImplementos() {
        httpClient.get("/implemento")
            .then(r => r.json())
            .then((r) => {
                r.map(implemento => implemento.impDataAquisicao = new Date(implemento.impDataAquisicao).toLocaleDateString()) // Formatando a data
                setListaImplementos(r)
            })
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Implementos</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/implemento/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Status', 'Ações']}
                    listaDados={listaImplementos.map(implemento => ({
                        id: implemento.impId,
                        Nome: implemento.impNome,
                        'Data de Aquisição': implemento.impDataAquisicao,
                        Status: implemento.equipamentoStatus.equipamentoStatusDescricao
                    }))}
                    renderActions={(implemento) => (
                        <div>
                            <a href="/manutencao"><i className="nav-icon fas fa-pen"></i></a>
                            <a href="/manutencao"><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}