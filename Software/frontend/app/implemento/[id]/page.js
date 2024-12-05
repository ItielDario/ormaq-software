'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import httpClient from '../../admin/utils/httpClient.js';
import Link from 'next/link';
import React from 'react';

export default function ExibirImplemento({ params: { id } }) {
    const [implementoSelecionado, setImplementoSelecionado] = useState(null);
    const [implementoImagens, setImplementoImagens] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState(null);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    useEffect(() => {
        httpClient.get(`/implemento/obter/exibir-classificados/${id}`)
        .then(r => r.json())
        .then(r => {
            r.implemento.impDataAquisicao = new Date(r.implemento.impDataAquisicao).toISOString().split('T')[0];

            if (r.imagensImplemento.length === 0) {
                r.imagensImplemento = [{
                imgUrl: '/image/sem-imagem.jpg',
                imgPrincipal: 1
                }];
            }

            setImplementoSelecionado(r.implemento);
            setImplementoImagens(r.imagensImplemento);
            setImagemPrincipal(r.imagensImplemento.find(img => img.imgPrincipal === 1));
        })
        .catch(error => {
            console.error("Erro ao carregar os dados do implemento:", error)
            setMostrarMensagem(true);
        });
    }, [id]);

    const alterarImagemPrincipal = (imagem) => {
        setImagemPrincipal(imagem);
    };

    return (
        <section className="content-main-children">
            <header className="header-classificados" style={{ position: 'static', height: 'auto' }}>
                {/* Cabeçalho da página */}
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
                            <Link href="https://www.instagram.com/ormaq.oficial/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram style={{ color: '#f1f1f1', fontSize: '2vw', margin: '0 0.5vw' }} />
                            </Link>
                            <Link href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp style={{ color: '#f1f1f1', fontSize: '2vw', margin: '0 0.5vw' }} />
                            </Link>
                        </div>
                    </nav>
                </section>
            </header>

            <section style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}} className='title-page'>
                <article>
                    <h3>CLASSIFICADOS</h3>
                    <p><Link href="/" className='link-voltar'>Ínicio &gt; Classificados &gt; Implemento</Link> &gt; <strong>{implementoSelecionado ? implementoSelecionado.impNome : ""}</strong></p>
                </article>

                <article>
                    <Link href={'/'}><FaArrowLeft style={{ color: '#646464', fontSize: '1.8vw', marginRight: '0.5vw', cursor: 'pointer' }}/></Link>
                </article>
            </section>

            {implementoSelecionado ? (
                <section className="main-container main-container-equipamento">
                    <section className="container-princial">
                        <section className="imagens-equipamento">
                            {imagemPrincipal ? (
                                <article className="imagem-principal">
                                    <img src={imagemPrincipal.imgUrl} alt={`Imagem principal do implemento`} />
                                </article>
                            ) : (
                                <p className="carregando">Carregando imagens...</p>
                            )}

                            <section className="container-todas-imagens">
                                {implementoImagens && implementoImagens.map((imagem, index) => (
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
                            <article className="detalhes-equipamento">
                                <h4>{implementoSelecionado ? implementoSelecionado.impNome : ""}</h4>
                                <ul className="info-lista">
                                    <li>Em estoque</li>
                                </ul>
                            </article>

                            <article>
                                <p className='preco-venda-equipamento'>R$ {implementoSelecionado ? implementoSelecionado.impPrecoVenda.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</p>
                            </article>

                            <section>
                                <Link className='btn-whats' href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                    <p><FaWhatsapp style={{ color: 'white', fontSize: '2vw', margin: '0 0.5vw' }} /></p>
                                    <p>ENVIAR MENSAGEM</p>
                                </Link>
                            </section>

                            <section class="mapa">
                                <article style={{marginTop: '0vw'}} className="mapa-endereco">
                                    <FaMapMarkerAlt style={{ color: '#c85446', fontSize: '1.5vw', marginRight: '0.5vw' }} />
                                    <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP</p>
                                </article>

                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3695.922373789556!2d-51.427536925479025!3d-22.12893521053385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1733405447301!5m2!1spt-BR!2sbr&q=Av.+Luis+Cez%C3%A1rio,+4908"
                                    class="mapa-peca-equipamento" 
                                >
                                </iframe>
                            </section>
                        </section>
                    </section>

                    <section className='descricao-equipemanto'>
                        <article className='title-descricao'>
                            <h4>Detalhes do Implemento</h4>
                        </article>

                        <article className="title-descricao">
                            {implementoSelecionado && (
                                <article className='decricao-dados' dangerouslySetInnerHTML={{ __html: implementoSelecionado.impDescricao }} />
                            )}
                        </article>
                    </section>
                </section>
            ) : (
                <section className="main-container main-container-equipamento">
                    {mostrarMensagem ? (
                        <section className="equipamento-nao-encontrado">
                            <article className="nao-encontrado-conteudo">
                                <h2>Implemento Não Encontrado</h2>
                                <p>O implemento que você está tentando visualizar não foi encontrado!</p>
                                <Link href={`/`}><p className="btn-voltar-classificados">VOLTAR PARA CLASSIFICADOS</p></Link>
                            </article>
                        </section>
                    ) : (
                        <p className="carregando">Carregando...</p>
                    )}
                </section>
            )}
            
            <article className="footer">
                <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
            </article>
        </section>
    );
}
