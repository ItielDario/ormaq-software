'use client';
import { useState, useEffect, useRef } from "react";
import CriarBotao from "../components/criarBotao.js";
import httpClient from "../utils/httpClient.js";

export default function Manutencao() {

    // Campos do formulário
    const observacaoRef = useRef(null);
    const dataTerminoRef = useRef(null);

    // Variáveis Auxiliares
    const [listaManutencoes, setListaManutencoes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false); // Modal para informações
    const [manutencaoId, setManutencaoId] = useState(null);
    const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null);
    const alertMsg = useRef(null);
    const alertMsgModal = useRef(null);
    let timeoutId = null;

    useEffect(() => {
        carregarManutencoes();
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, []);

    function carregarManutencoes() {
        httpClient.get("/manutencao")
        .then(r => r.json())
        .then((r) => {
            r.map(manutencao => {
                manutencao.manDataInicio = new Date(manutencao.manDataInicio).toLocaleDateString();
                manutencao.manDataTermino = manutencao.manDataTermino ? new Date(manutencao.manDataTermino).toLocaleDateString() : " -";
            });
            setListaManutencoes(r);
        });
    }

    function excluirManutencao(idManutencao) {
        if (confirm("Tem certeza que deseja excluir essa manutenção?")) {
            let status = 0;

            httpClient.delete(`/manutencao/${idManutencao}`)
            .then(r => {
                status = r.status;
                return r.json();
            })
            .then(r => {
                if (status == 200) {
                    carregarManutencoes();
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

    function abrirModalFinalizacao(id) {
        const manutencao = listaManutencoes.find(item => item.manId === id);
        setManutencaoId(id);
        setManutencaoSelecionada(manutencao);
        setShowModal(true);
    }

    function abrirModalInfo(id) {
        const manutencao = listaManutencoes.find(item => item.manId === id);
        setManutencaoId(id);
        setManutencaoSelecionada(manutencao);
        setShowModalInfo(true);
    }

    function fecharModal() {
        setShowModal(false); // Fechar modal de finalizar manutenção
        setShowModalInfo(false); // Fechar modal de informações
        setManutencaoSelecionada(null);
    }

    function finalizarManutencao() {
        alertMsg.current.style.display = 'none';
        alertMsgModal.current.style.display = 'none';
        let status = 0;

        const dados = {
            manId: manutencaoId,
            manEqpId: manutencaoSelecionada.manEqpId,
            maqEqpTipo: manutencaoSelecionada.maqEqpTipo,
            manObservacao: observacaoRef.current.value,
            manDataTermino: dataTerminoRef.current.value,
        };

        // Validação de campos vazios
        if (dataTerminoRef.current.value == '' || dataTerminoRef.current.value == null || dataTerminoRef.current.value == undefined) {
            setTimeout(() => {
                alertMsgModal.current.className = 'alertError';
                alertMsgModal.current.style.display = 'block';
                alertMsgModal.current.textContent = 'Por favor, preencha a data de término corretamente!';
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
            }, 100);
            return;
        }

        const dataTermino = new Date(dataTerminoRef.current.value);
        dataTermino.setDate(dataTermino.getDate() + 1);

        const dataInicio = new Date(manutencaoSelecionada.manDataInicio);
        const dataFinalPrevista = new Date(new Date(dataTermino.toLocaleDateString()));

        // Validação de data de término
        if (dataInicio > dataFinalPrevista) {
            setTimeout(() => {
                alertMsgModal.current.className = 'alertError';
                alertMsgModal.current.style.display = 'block';
                alertMsgModal.current.textContent = 'A data de término da manutenção deve ser após a data de início!';
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
            }, 100);
            return;
        }

        httpClient.put(`/manutencao/finalizar`, dados)
        .then(r => {
            status = r.status;
            return r.json();
        })
        .then((r) => {
            if (status == 201) {
                fecharModal();
                carregarManutencoes();
                alertMsg.current.className = 'alertSuccess';
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

                timeoutId = setTimeout(() => {
                    if (alertMsg.current) {
                        alertMsg.current.style.display = 'none';
                    }
                }, 6000);
            } 
            else {
                alertMsgModal.current.className = 'alertError';
                alertMsgModal.current.style.display = 'block';
                alertMsgModal.current.textContent = r.msg;
            }
        })
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Lista de Manutenções</h1>
            </article>

            <article className="container-btn-cadastrar">
                <CriarBotao value='Cadastrar' href='/admin/manutencao/cadastrar' class='btn-cadastrar'></CriarBotao>
            </article>

            <article ref={alertMsg}></article>

            <article className="container-table">
                <table>
                    <thead>
                        <tr>
                            <th>Info</th>
                            <th>Nome do Equipamento</th>
                            <th>Tipo do Equipamento</th>
                            <th>Data de Início</th>
                            <th>Data de Término</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaManutencoes.map((manutencao) => (
                            <tr key={manutencao.manId}>
                                <td>
                                    <a onClick={() => abrirModalInfo(manutencao.manId)}><i className="nav-icon fas fa-info-circle"></i></a>
                                </td>
                                <td>{manutencao.manEqpNome}</td>
                                <td>{manutencao.maqEqpTipo}</td>
                                <td>{manutencao.manDataInicio}</td>
                                <td>{manutencao.manDataTermino}</td>
                                <td>{manutencao.manStatus}</td>
                                <td>
                                    <div className="btn-acoes">
                                        {manutencao.manStatus !== 'Finalizada' && (
                                            <div>
                                                <a onClick={() => abrirModalFinalizacao(manutencao.manId)}><i className="nav-icon fas fa-clipboard-check"></i></a>
                                                <a href={`/admin/manutencao/alterar/${manutencao.manId}`}><i className="nav-icon fas fa-pen"></i></a>
                                            </div>
                                        )}
                                        <a onClick={() => excluirManutencao(manutencao.manId)}><i className="nav-icon fas fa-trash"></i></a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>

            {showModal && manutencaoSelecionada && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Finalizar Manutenção</h2>
                            <button className="modal-close" onClick={fecharModal} aria-label="Fechar modal">✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-data">
                                <p><strong>Nome do Equipamento:</strong> {manutencaoSelecionada.manEqpNome}</p>
                                <p><strong>Data de Início da Manutenção:</strong> {manutencaoSelecionada.manDataInicio}</p>
                            </div>

                            <article ref={alertMsgModal}></article>

                            <div className="modal-form">
                                <label>Data de Término:</label>
                                <input type="date" ref={dataTerminoRef} className="modal-input"/>

                                <label>Observação:</label>
                                <textarea ref={observacaoRef} placeholder="Digite uma observação" className="modal-input" maxLength="150"/>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className='btn-voltar' onClick={fecharModal}>Cancelar</button>
                            <button type="button" className='btn-cadastrar' onClick={finalizarManutencao}>Finalizar Manutenção</button>
                        </div>
                    </div>
                </div>
            )}

            {showModalInfo && manutencaoSelecionada && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Informações da Manutenção</h2>
                            <button className="modal-close" onClick={fecharModal} aria-label="Fechar modal">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-data modal-data-info">
                                <p className="data-info"><strong>Nome do Equipamento:</strong> {manutencaoSelecionada.manEqpNome}</p>
                                <p className="data-info"><strong>Tipo do Equipamento:</strong> {manutencaoSelecionada.maqEqpTipo}</p>
                                <p className="data-info"><strong>Data de Início:</strong> {manutencaoSelecionada.manDataInicio}</p>
                                <p className="data-info"><strong>Data de Término:</strong> {manutencaoSelecionada.manDataTermino}</p>
                                <p className="data-info"><strong>Descrição:</strong> {manutencaoSelecionada.manDescricao}</p>
                                <p className="data-info"><strong>Status:</strong> {manutencaoSelecionada.manStatus}</p>
                                <p className="data-info data-info-ultimo"><strong>Observações:</strong> {manutencaoSelecionada.manObservacao}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className='btn-voltar' onClick={fecharModal}>Voltar</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}