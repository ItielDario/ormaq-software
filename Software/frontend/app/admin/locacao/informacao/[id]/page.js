'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../utils/httpClient.js";
import CriarBotao from "../../../components/criarBotao.js";

export default function InfoLocacao({ params: { id } }) {
    const [locacao, setLocacao] = useState(null);
    const [itensLocacao, setItensLocacao] = useState([]);

    useEffect(() => {
        if (id) {
          httpClient.get(`/locacao/${id}`)
          .then(r => r.json())
          .then(data => {
            if (data.locacao) {
              data.locacao.locDataInicio = new Date(data.locacao.locDataInicio).toLocaleDateString();
              data.locacao.locDataFinalPrevista = new Date(data.locacao.locDataFinalPrevista).toLocaleDateString();
              data.locacao.locDataFinalEntrega = data.locacao.locDataFinalEntrega 
                ? new Date(data.locacao.locDataFinalEntrega).toLocaleDateString() 
                : "Não entregue";
              setLocacao(data.locacao);
            }

            console.log(data.locacao)

            setItensLocacao(data.itensLocacao || []);
          })
          .catch(error => console.error("Erro ao buscar locação:", error));
        }
    }, [id]);

    const handlePrint = () => {
        const printContent = document.getElementById("print-section");
        if (!printContent) {
            alert("Nenhuma infromação disponível para impressão.");
            return;
        }

        const htmlImpressao = `
            <html>
            <head>
                <title>Imprimir Locação</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 2vw;
                    }
                    h2 {
                        text-align: left;
                        margin-top: 10vw; 
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
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
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

    if (!locacao) {
        return <p>Carregando informações da locação...</p>;
    }

    return (
        <section className="content-main-children-listar">
            <article className="title">
              <h1>Informações da Locação</h1>
              <button onClick={handlePrint} className="btn-imprimir">Imprimir</button>
            </article>

            <div id="print-section">
                <article className="container-info">
                    <h2>Dados da Locação</h2>
                    <p className="data-info"><strong>Data de Início:</strong> {locacao.locDataInicio}</p>
                    <p className="data-info"><strong>Data de Entrega Esperada:</strong> {locacao.locDataFinalPrevista}</p>
                    <p className="data-info"><strong>Data de Entrega Realizada:</strong> {locacao.locDataFinalEntrega}</p>
                    <p className="data-info"><strong>Valor Final:</strong> R$ {locacao.locValorFinal ? parseFloat(locacao.locValorFinal).toFixed(2) : 'N/A'}</p>
                    <p className="data-info"><strong>Desconto:</strong> R$ {locacao.locDesconto ? parseFloat(locacao.locDesconto).toFixed(2) : '0,00'}</p>
                    <p className="data-info"><strong>Valor da Hora Extra:</strong> R$ {locacao.locPrecoHoraExtra ? parseFloat(locacao.locPrecoHoraExtra).toFixed(2) : '0,00'}</p>
                    <p className="data-info data-info-ultimo"><strong>Status:</strong> {locacao.locStaDescricao}</p>
                </article>

                <article className="container-table">
                    <h2 style={{ marginBottom: '0.7vw' }}>Itens da Locação</h2>

                    {itensLocacao.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Modelo</th>
                                    <th>Serie/Chassi</th>
                                    <th>Subtotal</th>
                                    <th>Plano</th>
                                    <th>Dias Locado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itensLocacao.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.maqId}</td>
                                        <td>{item.maqNome}</td>
                                        <td>{item.maqModelo}</td>
                                        <td>{item.maqSerie}</td>
                                        <td>R$ {parseFloat(item.iteLocValorUnitario).toFixed(0)},00</td>
                                        <td>{item.iteLocPlanoAluguel}</td>
                                        <td>{item.iteLocQuantDias}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum item associado a esta locação.</p>
                    )}
                </article>

                <article className="container-info">
                    <h2>Dados do Cliente</h2>
                    <p className="data-info"><strong>Nome:</strong> {locacao.cliNome}</p>
                    <p className="data-info"><strong>CPF/CNPJ:</strong> {locacao.cliCPF_CNPJ}</p>
                    <p className="data-info"><strong>Email:</strong> {locacao.cliEmail || "Email não cadastrado"}</p>
                    <p className="data-info data-info-ultimo"><strong>Telefone:</strong> {locacao.cliTelefone || "Telefone não cadastrado"}</p>
                </article>
            </div>

            <div className="container-btn-cadastrar container-btn-info">
                <CriarBotao value='Voltar' href='/admin/locacao' class='btn-voltar' />
            </div>
        </section>
    );
}
