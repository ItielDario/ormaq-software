'use client';
import { useState, useEffect, useRef } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Usuario() {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const alertMsg = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarUsuarios();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarUsuarios() {
        httpClient.get("/usuario")
        .then(r => r.json())
        .then((r) => {
            console.log(r)
            setListaUsuarios(r);
        });
    }

    function excluirUsuario(idUsuario) {
        if (confirm("Tem certeza que deseja excluir esse usuário?")) {
            let status = 0;

            httpClient.delete(`/usuario/${idUsuario}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status === 200) {
                    carregarUsuarios();
                    alertMsg.current.className = 'alertSuccess';
                } else {
                    alertMsg.current.className = 'alertError';
                }

                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

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
                <h1>Lista de Usuários</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/admin/usuario/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <MontarTabela
                    cabecalhos={['ID', 'Nome', 'Telefone', 'Email', 'Perfil', 'Ações']}
                    listaDados={listaUsuarios.map(usuario => ({
                        id: usuario.usuId,
                        Nome: usuario.usuNome,
                        Telefone: usuario.usuTelefone || 'Sem Telefone',
                        Email: usuario.usuEmail || 'Sem Email',
                        Perfil: usuario.usuPerDescricao
                    }))}
                    renderActions={(usuario) => (
                        <div>
                            <a href={`/admin/usuario/alterar/${usuario.id}`}><i className="nav-icon fas fa-pen"></i></a>
                            <a onClick={() => excluirUsuario(usuario.id)}><i className="nav-icon fas fa-trash"></i></a>
                        </div>
                    )}
                />
            </article>
        </section>
    );
}
