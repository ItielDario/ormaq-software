'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function FinalizarLocacao({ params: { id } }) {
    const [locacao, setLocacao] = useState(null);
    const [itensLocacao, setItensLocacao] = useState([]);
    const [dataTermino, setDataTermino] = useState('');
    const [horasUso, setHorasUso] = useState({});

    useEffect(() => {
        if (id) {
            httpClient.get(`/locacao/${id}`)
                .then(r => r.json())
                .then(data => {
                    if (data.locacao) {
                        data.locacao.locDataInicio = new Date(data.locacao.locDataInicio).toLocaleDateString();
                        data.locacao.locDataFinalPrevista = new Date(data.locacao.locDataFinalPrevista).toLocaleDateString();
                        setLocacao(data.locacao);
                    }
                    setItensLocacao(data.itensLocacao || []);
                })
                .catch(error => console.error("Erro ao buscar locação:", error));
        }
    }, [id]);

    const handleHorasUsoChange = (itemId, value) => {
        setHorasUso(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const handleFinalizarLocacao = () => {
        const dadosFinalizacao = {
            dataTermino,
            horasUso: horasUso,
        };

        httpClient.post(`/locacao/${id}/finalizar`, dadosFinalizacao)
            .then(response => {
                alert("Locação finalizada com sucesso!");
            })
            .catch(error => {
                console.error("Erro ao finalizar locação:", error);
                alert("Erro ao finalizar locação.");
            });
    };

    if (!locacao) {
        return <p>Carregando informações da locação...</p>;
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Finalizar Locação</h1>
            </article>

            <article className="container-info">
                <h2 className="title-info">Dados da Locação</h2>
                <p className="data-info"><strong>Data de Início:</strong> {locacao.locDataInicio}</p>
                <p className="data-info"><strong>Data de Entrega Esperada:</strong> {locacao.locDataFinalPrevista}</p>
                <p className="data-info data-info-ultimo"><strong>Status:</strong> {locacao.locStaDescricao}</p>
            </article>

            <article className="container-form">
                <h2>Finalizar Locação</h2>
                <label className="form-label">
                    Data de Término:
                    <input
                        type="date"
                        value={dataTermino}
                        onChange={(e) => setDataTermino(e.target.value)}
                        required
                    />
                </label>

                {itensLocacao.filter(item => item.tipo === "Máquina").length > 0 && (
                    <>
                        <h3>Horas de Uso das Máquinas</h3>
                        {itensLocacao.filter(item => item.tipo === "Máquina").map(item => (
                            <label key={item.id} className="form-label">
                                {item.nome} - Quantidade: {item.quantidade}
                                <input
                                    type="number"
                                    placeholder="Horas de uso"
                                    value={horasUso[item.id] || ""}
                                    onChange={(e) => handleHorasUsoChange(item.id, e.target.value)}
                                    required
                                />
                            </label>
                        ))}
                    </>
                )}

                <button onClick={handleFinalizarLocacao} className="btn-finalizar">
                    Finalizar Locação
                </button>
            </article>

            <div className="container-btn-cadastrar">
                <CriarBotao value='Voltar' href='/locacao' class='btn-voltar' />
            </div>
        </section>
    );
}