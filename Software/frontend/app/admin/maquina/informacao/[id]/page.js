'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function InfoMaquina({ params: { id } }) {
    const [maquina, setMaquina] = useState(null);
    const [alugueisMaquina, setAlugueisMaquina] = useState([]);
    const [imagensMaquina, setImagensMaquina] = useState([]);

    useEffect(() => {
        if (id) {
            httpClient.get(`/maquina/${id}`)
                .then(r => r.json())
                .then(data => {
                    if (data) {
                        setMaquina(data.maquina);
                        setAlugueisMaquina(data.maquinaAluguel);
                        setImagensMaquina(data.imagensMaquina);
                    }
                })
                .catch(error => console.error("Erro ao buscar dados da máquina:", error));
        }
    }, [id]);

    const handlePrint = () => {
        const printContent = document.getElementById("print-section");
        if (!printContent) {
            alert("Nenhuma informação disponível para impressão.");
            return;
        }

        const htmlImpressao = `
            <html>
            <head>
                <title>Imprimir Máquina</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 2vw;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 2vw;
                    }
                    th, td {
                        border: 0.1vw solid #ddd;
                        padding: 0.6vw;
                        text-align: left;
                        font-size: 2vw;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                    .container-table{
                        margin-top: 5vw;
                    }
                    .container-imagens {
                        margin-top: 7vw;
                    }
                    .grid-imagens {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 1vw;
                        margin-top: 1vw;
                    }
                    .grid-item {
                        position: relative;
                        border: 0.1vw solid #ddd;
                        border-radius: 0.4vw;
                        overflow: hidden;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .grid-item img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }
                    .badge {
                        position: absolute;
                        top: 0.5vw;
                        left: 0.5vw;
                        background-color: #4caf50;
                        color: white;
                        padding: 0.2vw 1vw;
                        border-radius: 0.4vw;
                        font-size: 0.8vw;
                        font-weight: bold;
                    }

                    @media print {
                        .container-table {
                            page-break-after: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                <div>${printContent.innerHTML}</div>
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

    if (!maquina) {
        return <p>Carregando informações da máquina...</p>;
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
                <h1>Informações da Máquina</h1>
                <button onClick={handlePrint} className="btn-imprimir">Imprimir</button>
            </article>

            <div id="print-section">
                <article className="container-info">
                    <h2>Dados da Máquina</h2>
                    <p className="data-info"><strong>Nome:</strong> {maquina.maqNome}</p>
                    <p className="data-info"><strong>Tipo:</strong> {maquina.maqTipo}</p>
                    <p className="data-info"><strong>Modelo:</strong> {maquina.maqModelo}</p>
                    <p className="data-info"><strong>Série:</strong> {maquina.maqSerie}</p>
                    <p className="data-info"><strong>Ano de Fabricação:</strong> {maquina.maqAnoFabricacao}</p>
                    <p className="data-info"><strong>Horas de Uso:</strong> {maquina.maqHorasUso || "Não informado"}</p>
                    <p className="data-info"><strong>Preço de Venda:</strong> R$ {maquina.maqPrecoVenda}</p>
                    <p className="data-info data-info-ultimo"><strong>Status:</strong> {maquina.eqpStaDescricao}</p>
                </article>

                <article className="container-table">
                    <h2 style={{ marginBottom: '0.7vw' }}>Informações de Aluguel</h2>

                    {alugueisMaquina ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Preço Diário</th>
                                    <th>Preço Semanal</th>
                                    <th>Preço Quinzenal</th>
                                    <th>Preço Mensal</th>
                                </tr>
                            </thead>
                            <tbody>   
                                <tr>
                                    <td>R$ {parseFloat(alugueisMaquina.maqAluPrecoDiario)}</td>
                                    <td>R$ {parseFloat(alugueisMaquina.maqAluPrecoSemanal)}</td>
                                    <td>R$ {parseFloat(alugueisMaquina.maqAluPrecoQuinzenal)}</td>
                                    <td>R$ {parseFloat(alugueisMaquina.maqAluPrecoMensal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>Não há informações de aluguel para esta máquina.</p>
                    )}
                </article>

                <article className="container-imagens">
                    <h2>Imagens da Máquina</h2>
                    <div className="grid-imagens">
                        {imagensMaquina.length > 0 ? (
                            imagensMaquina.map((imagem) => (
                                <div className="grid-item" key={imagem.imgId}>
                                    <img src={imagem.imgUrl} alt={`Imagem da Máquina ${imagem.imgId}`} />
                                    {imagem.imgPrincipal == 1 ? <span className="badge">Imagem de capa</span> : ''}
                                </div>
                            ))
                        ) : (
                            <p>Não há imagens cadastradas para esta máquina.</p>
                        )}
                    </div>
                </article>
            </div>

            <div className="container-btn-cadastrar container-btn-info">
                <CriarBotao value='Voltar' href='/admin/maquina' class='btn-voltar' />
            </div>
        </section>
    );
}
