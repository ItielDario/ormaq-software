'use client';
import { useEffect, useState, useRef } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function FinalizarLocacao({ params: { id } }) {

    // Campos do formulário
    const dataTermino = useRef(null);
    const [horasUso, setHorasUso] = useState([]);

    // Variáveis Auxiliares
    const [locacao, setLocacao] = useState(null);
    const [itensLocacao, setItensLocacao] = useState([]);
    const alertMsg = useRef(null);
    const containerFormRef = useRef(null);
    const btnFinalizarRef = useRef(null);
    
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

    // Função para garantir que a data esteja no formato 'yyyy-mm-dd'
    function formatarDataParaISO(data) {
        const partes = data.split('/');
        return `${partes[2]}-${partes[1]}-${partes[0]}`;  // Converte 'dd/mm/yyyy' para 'yyyy-mm-dd'
    }


    const handleHorasUsoChange = (itemId, value) => {
        setHorasUso(prev => ({
            ...prev,
            [itemId]: value
        }));
    };

    const finalizarLocacao = () => {
        alertMsg.current.style.display = 'none';
        let status = 0;
        
        const dataInicio = new Date(formatarDataParaISO(locacao.locDataInicio));
        dataInicio.setDate(dataInicio.getDate() + 1);

        const dataFinalTermino = new Date(dataTermino.current.value);
        dataFinalTermino.setDate(dataFinalTermino.getDate() + 1);
        
        // Verifica se a data de término foi preenchida
        if (!dataTermino.current.value) {
            setTimeout(() => {
                alertMsg.current.className = 'alertError';
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = 'Por favor, informe a data de término!';
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
                }, 100);
            return;
        }

        // Verifica se a data de término é anterior à data de início
        if (dataFinalTermino < dataInicio) {
            setTimeout(() => {
                alertMsg.current.className = 'alertError';
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = 'A data de término da locação deve ser após a data de início!';
                document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
                }, 100);
            return;
        }

        // Verifica se as horas de uso estão preenchidas para todos os itens do tipo 'Máquina'
        for (const item of itensLocacao) {
            if (item.iteLocTipo === "Máquina" && !horasUso[item.iteLocId]) {
                setTimeout(() => {
                    alertMsg.current.className = 'alertError';
                    alertMsg.current.style.display = 'block';
                    alertMsg.current.textContent = `As horas de uso para a máquina ${item.iteLocNome} não foram preenchidas!`;
                    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
                    }, 100);
                return;
            }
        }

        const dados = {
            locId: parseInt(id),
            locDataFinalEntrega: dataTermino.current.value,
            maqHorasUso: horasUso,
            itensLocacao: itensLocacao
        };

        httpClient.put(`/locacao/finalizar`, dados)
        .then(r => {
            status = r.status;
            return r.json();
        })
        .then((r) => {
            if (status == 201) {
                alertMsg.current.className = 'alertSuccess';
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;

                containerFormRef.current.style.display = 'none';
                btnFinalizarRef.current.style.display = 'none';
            } 
            else {
                alertMsg.current.className = 'alertError';
                alertMsg.current.style.display = 'block';
                alertMsg.current.textContent = r.msg;
            }
        })

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
                <p className="data-info"><strong>Cliente:</strong> {locacao.cliNome} - {locacao.cliCPF_CNPJ}</p>
                <p className="data-info"><strong>Data de Início:</strong> {locacao.locDataInicio}</p>
                <p className="data-info"><strong>Data de Entrega Esperada:</strong> {locacao.locDataFinalPrevista}</p>
                <p className="data-info"><strong>Valor Final:</strong> R$ {locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A'}</p>
                <p className="data-info data-info-ultimo"><strong>Desconto:</strong> R$ {locacao.locDesconto ? parseFloat(locacao.locDesconto).toFixed(2) : '0,00'}</p>
            </article>

            <article ref={alertMsg}></article>

            <article ref={containerFormRef} className="container-form">
                <section>
                    <label className="form-label">Data de Término: </label>
                    <input type="date" ref={dataTermino} required/>
                </section>

                <section>
                    {itensLocacao.filter(item => item.iteLocTipo === "Máquina").length > 0 && (
                        <article className="container-horas-usadas">
                            <h3>Atualização de Horas de Uso das Máquinas</h3>
                            {itensLocacao.filter(item => item.iteLocTipo === "Máquina").map(item => (
                                <label key={item.iteLocId} className="from-label input-horas-usadas">
                                    Nova hora de operação - {item.iteLocNome}:
                                    <input
                                        type="number"
                                        value={horasUso[item.iteLocId] || ""}
                                        onChange={(e) => handleHorasUsoChange(item.iteLocId, e.target.value)}
                                        required
                                    />
                                </label>
                            ))}
                        </article>
                    )}
                </section>
            </article>

            <section className="container-btn container-btn-finalizar">
                <CriarBotao value='Voltar' href='/locacao' class='btn-voltar'></CriarBotao>
                <button type="button" ref={btnFinalizarRef} className='btn-cadastrar' onClick={finalizarLocacao}>Finalizar Locação</button>
            </section>
        </section>
    );
}