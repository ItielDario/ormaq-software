'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function InfoManutencao({ params: { id } }) {
    const [manutencao, setManutencao] = useState(null);
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        if (id) {
            httpClient.get(`/manutencao/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data) {
                    data.manDataInicio = new Date(data.manDataInicio).toLocaleDateString();
                    data.manDataTermino = data.manDataTermino
                        ? new Date(data.manDataTermino).toLocaleDateString()
                        : "Não entregue";
                    setManutencao(data);
                    buscarHistorico(data.maqEqpTipo, data.manEqpId);
                    console.log(data)
                }
            })
            .catch(error => console.error("Erro ao buscar dados da manutenção:", error));
        }
    }, [id]);

    const buscarHistorico = (equipamentoTipo, equipamentoId) => {
        const body = { equipamentoTipo, equipamentoId };

        httpClient.post(`/manutencao/historico`, body)
        .then(r => r.json())
        .then(data => {setHistorico(data); console.log(data)})
        .catch(error => console.error("Erro ao buscar histórico:", error));
    };

    const handlePrint = () => {
        const printContentDados = document.getElementById("print-section");
        const printContentHistorico = document.getElementById("historico-section");
        if (!printContentDados) {
            alert("Nenhuma informação disponível para impressão.");
            return;
        }

        const htmlImpressao = `
            <html>
            <head>
                <title>Imprimir Histórico</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 2vw;
                    }
                    .container-info{
                        margin-top: 6vw;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    th {
                        background-color: #f4f4f4;
                        text-align: left;
                    }
                    @media print {
                        body {
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div>${printContentDados.innerHTML}</div>
                <br/></br/>
                <hr/>
                <br/>
                <div>${printContentHistorico.innerHTML}</div>
            </body>
            </html>
        `;

        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.top = "-10000px";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlImpressao);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        };
    };

    if (!manutencao) {
        return <p>Carregando informações da manutenção...</p>;
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Informações da Manutenção</h1>
                <button onClick={handlePrint} className="btn-imprimir">Imprimir Histórico</button>
            </article>

            <div id="print-section">
                <article className="container-info">
                    <h2 className="title-info">Dados da Manutenção</h2>
                    <p className="data-info"><strong>Nome:</strong> {manutencao.manEqpNome}</p>
                    <p className="data-info"><strong>Tipo do equimento:</strong> {manutencao.maqEqpTipo}</p>
                    <p className="data-info"><strong>Descrição:</strong> {manutencao.manDescricao}</p>
                    <p className="data-info"><strong>Data de Início:</strong> {manutencao.manDataInicio}</p>
                    <p className="data-info"><strong>Data de Término:</strong> {manutencao.manDataTermino || "Em andamento"}</p>
                    <p className="data-info"><strong>Observação:</strong> {manutencao.manObservacao || "Sem observações"}</p>
                    <p className="data-info data-info-ultimo"><strong>Status:</strong> {manutencao.manStatus}</p>
                </article>
            </div>

            <div id="historico-section">
                <h2 className="title-info" >Histórico de Manutenções</h2>

                {historico.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Data de Início</th>
                                <th>Data de Término</th>
                                <th>Descrição</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historico.map((h, index) => (
                                <tr key={index}>
                                    <td>{h.manEqpNome}</td>
                                    <td>{new Date(h.manDataInicio).toLocaleDateString()}</td>
                                    <td>{h.manDataTermino ? new Date(h.manDataTermino).toLocaleDateString() : "Em andamento"}</td>
                                    <td>{h.manDescricao}</td>
                                    <td>{h.manStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Sem histórico disponível.</p>
                )}
            </div>

            <div className="container-btn-cadastrar container-btn-info">
                <CriarBotao value="Voltar" href="/admin/manutencao" class="btn-voltar" />
            </div>
        </section>
    );
}