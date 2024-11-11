'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js"

export default function Cliente() {
    const [listaClientes, setListaClientes] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null; // Armazena o timeoutId

    useEffect(() => {
        carregarClientes();

        // Cleanup function para limpar o timeout quando o componente desmontar
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId); // Limpa o timeout
            }
        };
    }, []);

    function carregarClientes() {
        httpClient.get("/cliente")
        .then(r => r.json())
        .then((r) => {
            setListaClientes(r);
        });
    }

    function excluirCliente(idCliente) {
        if(confirm("Tem certeza que deseja excluir esse cliente?")) {
            let status = 0;

            httpClient.delete(`/cliente/${idCliente}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if(status === 200) {
                    carregarClientes();
                    alertMsg.current.className = 'alertSuccess';
                } else {
                    alertMsg.current.className = 'alertError';
                }

                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

                // Inicia o setTimeout e armazena o ID
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
                <h1>Lista de Clientes</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/cliente/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'CPF/CNPJ', 'Telefone', 'Email', 'Ações']}
                    listaDados={listaClientes.map(cliente => ({
                        id: cliente.cliId,
                        Nome: cliente.cliNome,
                        'CPF/CNPJ': cliente.cliCPF_CNPJ,
                        Telefone: cliente.cliTelefone || 'Sem Telefone',
                        Email: cliente.cliEmail || 'Sem Email',
                    }))}
                    renderActions={(cliente) => (
                        <div>
                            <a href={`/cliente/alterar/${cliente.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirCliente(cliente.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}
