'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Implemento() {
    const [listaImplementos, setListaImplementos] = useState([]);

    useEffect(() => {
        carregarImplementos();
    }, []);

    function carregarImplementos() {
        fetch('http://localhost:5000/implemento', { credentials: "include" })
            .then(r => r.json())
            .then((r) => {
              setListaImplementos(r)
              console.log(r)
              console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
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
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Descrição', 'Status']}
                    listaDados={listaImplementos.map(implemento => ({
                        id: implemento.impId,
                        Nome: implemento.impNome,
                        'Data de Aquisição': implemento.impDataAquisicao,
                        Descrição: implemento.impDescricao,
                        Status: implemento.equipamentoStatus.equipamentoStatusDescricao
                    }))}
                    renderActions={(implemento) => (
                        <div>
                            <button>Editar</button>
                            <button>Deletar</button>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}