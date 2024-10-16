'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Peca() {
    const [listaPecas, setListaPecas] = useState([]);

    useEffect(() => {
        carregarPecas();
    }, []);

    function carregarPecas() {
        fetch('http://localhost:5000/peca', { credentials: "include" })
            .then(r => r.json())
            .then((r) => {
              setListaPecas(r);
              console.log(r)
            })
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
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Descrição', 'Status']}
                    listaDados={listaPecas.map(peca => ({
                        id: peca.pecId,
                        Nome: peca.pecNome,
                        'Data de Aquisição': peca.pecDataAquisicao,
                        Descrição: peca.pecDescricao,
                        Status: peca.equipamentoStatus.equipamentoStatusDescricao
                    }))}
                    renderActions={(peca) => (
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