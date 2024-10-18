'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Maquina() {
    const [listaMaquinas, setListaMaquinas] = useState([]);

    useEffect(() => {
        carregarMaquinas();
    }, []);

    function carregarMaquinas() {
        httpClient.get("/maquina")
        .then(r => r.json())
        .then((r) => {
            r.map(maquina => maquina.maqDataAquisicao = new Date(maquina.maqDataAquisicao).toLocaleDateString()) // Formatando a data
            setListaMaquinas(r)
        })
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Máquinas</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

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
                            <a href={`/maquina/excluir/${maquina.id}`}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}