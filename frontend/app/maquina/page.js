'use client';
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Maquina() {
    const [listaMaquinas, setListaMaquinas] = useState([]);

    useEffect(() => {
        carregarMaquinas();
    }, []);

    function carregarMaquinas() {
      fetch('http://localhost:5000/maquina', { credentials: "include" })
        .then(r => r.json())
        .then(r => setListaMaquinas(r));
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
                    cabecalhos={['ID', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status']}
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
                            <button>Editar</button>
                            <button>Deletar</button>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}