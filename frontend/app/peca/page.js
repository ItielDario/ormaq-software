'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Peca() {
    const [listaPecas, setListaPecas] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarPecas();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarPecas() {
        httpClient.get("/peca")
            .then(r => r.json())
            .then((r) => {
                r.map(peca => peca.pecaDataAquisicao = new Date(peca.pecaDataAquisicao).toLocaleDateString()) // Formatando a data
                setListaPecas(r)
            })
    }

    function excluirPeca(idPeca) {
        if (confirm("Tem certeza que deseja excluir essa peça?")) {
            let status = 0;
    
            httpClient.delete(`/peca/${idPeca}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status === 200) {
                    carregarPecas();
                    alertMsg.current.className = 'alertSuccess';
                } else {
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
            });
        }
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Peças</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/peca/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

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
                            <a href={`/peca/alterar/${peca.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirPeca(peca.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}