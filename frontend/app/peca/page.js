'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Peca() {
    const [listaPecas, setListaPecas] = useState([]);

    useEffect(() => {
        carregarPecas();
    }, []);

    function carregarPecas() {
        httpClient.get("/peca")
            .then(r => r.json())
            .then((r) => setListaPecas(r))
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Peças</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/peca/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Status', 'Ações']}
                    listaDados={listaPecas.map(peca => ({
                        id: peca.pecaId,
                        Nome: peca.pecaNome,
                        'Data de Aquisição': peca.pecaDataAquisicao,
                        Status: peca.equipamentoStatus.equipamentoStatusDescricao                    
                    }))}
                    renderActions={(peca) => (
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