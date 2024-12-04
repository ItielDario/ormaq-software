'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import httpClient from "../../admin/utils/httpClient.js";
import Link from "next/link";
import React from 'react';

export default function ExibirMaquina({ params: { id } }) {

  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [maquinaAluguelSelecionada, setMaquinaAluguelSelecionada] = useState(null);
  const [maquinaImagensSelecionada, setMaquinaImagensSelecionada] = useState(null);
  const [imagemPrincipal, setImagemPrincipal] = useState(null); // Estado para imagem principal

  useEffect(() => {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        r.maquina.maqDataAquisicao = new Date(r.maquina.maqDataAquisicao).toISOString().split('T')[0];

        if(r.imagensMaquina.length == 0){
            r.imagensMaquina = [{
                imgUrl: '/image/sem-imagem.jpg',
                imgPrincipal: 1
            }]
        }

        setMaquinaSelecionada(r.maquina);
        setMaquinaImagensSelecionada(r.imagensMaquina);
        setMaquinaAluguelSelecionada(r.maquinaAluguel);
        setImagemPrincipal(r.imagensMaquina.find(img => img.imgPrincipal == 1)); // Define a primeira imagem como principal

        console.log(r)
      })
      .catch(error => console.error("Erro ao carregar os dados da máquina:", error));
  }, [id]);

  // Função para alterar a imagem principal ao clicar em uma das imagens
  const alterarImagemPrincipal = (imagem) => {
    setImagemPrincipal(imagem); // Atualiza a imagem principal com a imagem clicada
  };

  return (
    <section className="content-main-children">
        <header className="header-classificados" style={{position: 'static', height: 'auto'}}>
            <section className="info-classificados">
            <article className="img-logo">
                <img src="/image/logo-ormaq-amarela.png" alt="Logo Ormaq" />
            </article>

            <article className="info">
                <article className="whatsapp">
                <FaWhatsapp style={{ color: '#69b74e', fontSize: '2vw', marginRight: '0.5vw' }} />
                <p>(18) 99694-6604</p>
                </article>

                <article className="telefone">
                <FaPhone style={{ color: '#4697c8', fontSize: '1.8vw', marginRight: '0.5vw' }} />
                <p>(18) 3928-6606</p>
                </article>

                <section className="endereco-container">
                <article className="endereco">
                    <FaMapMarkerAlt style={{ color: '#c85446', fontSize: '1.8vw', marginRight: '0.5vw' }} />
                    <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP, 19061-145</p>
                </article>

                {/* <article className="endereco">
                    <FaMapMarkerAlt style={{ color: '#c85446', fontSize: '1.8vw', marginRight: '0.5vw' }} />
                    <p>Rua Amazonas, 461 - Parque Paulistano, Bauru - SP, 17030-570</p>
                </article> */}
                </section>
            </article>
            </section>

            <section>
            <nav className="links-classificados">
                <ul className="menu">
                <li><Link href="https://ormaq.com.br/">INÍCIO</Link></li>
                <li><Link href="/">CLASSIFICADOS</Link></li>
                <li><Link href="https://ormaq.com.br/sobre-nos/">SOBRE NÓS</Link></li>
                <li><Link href="https://ormaq.com.br/servicos/">SERVIÇOS</Link></li>
                <li><Link href="https://ormaq.com.br/noticias/">NOTÍCIAS</Link></li>
                <li><Link href="https://ormaq.com.br/contato/">CONTATO</Link></li>
                </ul>
                <div className="social-icons">
                <Link href="https://www.facebook.com/ormaq.oficial?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                    <FaFacebook style={{ color: '#f1f1f1', fontSize: '2vw', margin: '0 0.5vw' }} />
                </Link>
                <Link href="https://www.instagram.com/ormaq.oficial/ " target="_blank" rel="noopener noreferrer">
                    <FaInstagram style={{ color: '#f1f1f1', fontSize: '2vw', margin: '0 0.5vw' }} />
                </Link>
                <Link href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp style={{ color: '#f1f1f1', fontSize: '2vw', margin: '0 0.5vw' }} />
                </Link>
                </div>
            </nav>
            </section>
        </header>

        <section className='title-page'>
            <h3>CLASSIFICADOS</h3>
            <p><Link href="/" className='link-voltar'>Ínicio &gt; Classificados &gt; Maquina</Link> &gt; <strong>{maquinaSelecionada ? maquinaSelecionada.maqNome : ""}</strong></p>
        </section>

        <section className="main-container main-container-equipamento">
            <section className="container-princial">
                <section className="imagens-equipamento">
                    {/* Exibe a imagem principal */}
                    {imagemPrincipal && (
                        <article className="imagem-principal">
                            <img src={imagemPrincipal.imgUrl} alt={`Imagem principal da máquina`} />
                        </article>
                    )}

                    {/* Exibe todas as outras imagens */}
                    <section className="container-todas-imagens">
                        {maquinaImagensSelecionada && maquinaImagensSelecionada.map((imagem, index) => (
                            <article
                                className={`imagem ${imagem.imgUrl === imagemPrincipal?.imgUrl ? 'imagem-destaque' : ''}`}
                                key={index}
                                onClick={() => alterarImagemPrincipal(imagem)}
                            >
                                <img src={imagem.imgUrl} alt={`Imagem ${index + 1}`} />
                            </article>
                        ))}
                    </section>
                </section>

                <section className='separacao'></section>

                <section className="informações-equipamento">
                    <article className="detalhes-maquina">
                        <h4>{maquinaSelecionada ? maquinaSelecionada.maqNome : ""}</h4>
                        <ul className="info-lista">
                        <li><h5>{maquinaSelecionada ? maquinaSelecionada.maqModelo : ""}</h5></li>
                        <li><strong>Ano de Fabricação:</strong> {maquinaSelecionada ? maquinaSelecionada.maqAnoFabricacao : ""}</li>
                        <li><strong>Condição:</strong> {maquinaSelecionada ? maquinaSelecionada.maqTipo : ""}</li>
                        <li><strong>Preço de Venda:</strong> R$ {maquinaSelecionada ? maquinaSelecionada.maqPrecoVenda .replace(".", ",") .replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</li>
                        </ul>
                    </article>

                    <article className="aluguel-maquina">
                        <h4>Informações de Aluguel</h4>

                        <table className="tabela-aluguel">
                            <thead>
                                <tr>
                                    <th>Planos</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>Diária</td>
                                    <td>R$ {maquinaAluguelSelecionada ? maquinaAluguelSelecionada.maqAluPrecoDiario.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</td>
                                </tr>
                                <tr>
                                    <td>Semanal</td>
                                    <td>R$ {maquinaAluguelSelecionada ? maquinaAluguelSelecionada.maqAluPrecoSemanal.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</td>
                                </tr>
                                <tr>
                                    <td>Quinzenal</td>
                                    <td>R$ {maquinaAluguelSelecionada ? maquinaAluguelSelecionada.maqAluPrecoQuinzenal.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</td>
                                </tr>
                                <tr>
                                    <td>Mensal</td>
                                    <td>R$ {maquinaAluguelSelecionada ? maquinaAluguelSelecionada.maqAluPrecoMensal.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center' }}>
                                        <p style={{ marginTop: '0', textAlign: 'center', fontStyle: 'italic', color: '#939393', fontSize: '1vw' }}>
                                            * Valores sujeitos à negociação
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </article>

                    <section>
                        <Link className='btn-whats' href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                            <p><FaWhatsapp style={{ color: 'white', fontSize: '2vw', margin: '0 0.5vw' }} /></p>
                            <p>ENVIAR MENSAGEM</p>
                        </Link>
                    </section>
                </section>
            </section>

            <section className='descricao-equipemanto'>
                <article className='title-descricao'>
                    <h4>Detalhes da Máquina</h4>
                </article>

                <article className="title-descricao">
                    {maquinaAluguelSelecionada && (
                        <article className='decricao-dados' dangerouslySetInnerHTML={{ __html: maquinaSelecionada.maqDescricao }} />
                    )}
                </article>
            </section>
        </section>

        

        <article className="footer">
            <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
        </article>
    </section>
  );
}