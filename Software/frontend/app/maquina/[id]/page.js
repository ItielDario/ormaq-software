'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaArrowLeft, FaBars } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import httpClient from "../../admin/utils/httpClient.js";
import Link from "next/link";
import React from 'react';

export default function ExibirMaquina({ params: { id } }) {

    const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
    const [maquinaAluguelSelecionada, setMaquinaAluguelSelecionada] = useState(null);
    const [maquinaImagensSelecionada, setMaquinaImagensSelecionada] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState(null); // Estado para imagem principal
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    // Referencias de elementos para mobile
    const [menuMobile, setMenuMobile] = useState(true);
    const menuMobileRef = useRef(null);

    useEffect(() => {
        httpClient.get(`/maquina/obter/exibir-classificados/${id}`)
        .then(r => r.json())
        .then(r => {
            console.log(r)
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
        })
        .catch(error => {
            console.error("Erro ao carregar os dados da máquina:", error)
            setMostrarMensagem(true);
        });
    }, [id]);

    // Função para alterar a imagem principal ao clicar em uma das imagens
    const alterarImagemPrincipal = (imagem) => {
        setImagemPrincipal(imagem); // Atualiza a imagem principal com a imagem clicada
    };

    const exibirMenu = () => {
        setMenuMobile(!menuMobile)
        menuMobile == true ? menuMobileRef.current.style.display = 'flex' : menuMobileRef.current.style.display = 'none'
    }

  return (
    <section className="content-main-children">
        <header className="header-classificados" style={{position: 'static', height: 'auto'}}>
            <section className="info-classificados">
            <article className="img-logo">
                <img src="/image/logo-ormaq-amarela.png" alt="Logo Ormaq" />
            </article>

            <article className="info">
                <article className="whatsapp">
                <FaWhatsapp className='faWhatsapp' style={{ color: '#69b74e' }} />
                <p>(18) 99694-6604</p>
                </article>

                <article className="telefone">
                <FaPhone className='faPhone' style={{ color: '#4697c8' }} />
                <p>(18) 3928-6606</p>
                </article>

                <section className="endereco-container">
                <article className="endereco">
                    <FaMapMarkerAlt className='faMapMarkerAlt' style={{ color: '#c85446' }} />
                    <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP, 19061-145</p>
                </article>

                {/* <article className="endereco">
                    <FaMapMarkerAlt style={{ color: '#c85446', fontSize: '1.8vw', marginRight: '0.5vw' }} />
                    <p>Rua Amazonas, 461 - Parque Paulistano, Bauru - SP, 17030-570</p>
                </article> */}
                </section>
            </article>
            </section>

            <section className='links-classificados-desktop'>
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
                        <FaFacebook className='faFacebook' style={{ color: '#f1f1f1' }} />
                    </Link>
                    <Link href="https://www.instagram.com/ormaq.oficial/ " target="_blank" rel="noopener noreferrer">
                        <FaInstagram className='faInstagram' style={{ color: '#f1f1f1' }} />
                    </Link>
                    <Link href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                        <FaWhatsapp className='faWhatsapp' style={{ color: '#f1f1f1' }} />
                    </Link>
                </div>
            </nav>
            </section> 

            <section className='links-classificados-mobile'>
                <nav className="links-classificados-box-mobile">
                    <article>
                        <div className="social-icons-mobile">
                            <Link href="https://www.facebook.com/ormaq.oficial?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className='faFacebook' style={{ color: '#f1f1f1' }} />
                            </Link>
                            <Link href="https://www.instagram.com/ormaq.oficial/ " target="_blank" rel="noopener noreferrer">
                                <FaInstagram className='faInstagram' style={{ color: '#f1f1f1' }} />
                            </Link>
                            <Link href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp className='faWhatsapp' style={{ color: '#f1f1f1' }} />
                            </Link>
                        </div>

                        <aside onClick={exibirMenu}>
                            <FaBars className='faBars' style={{ color: 'whaite' }} />
                        </aside>
                    </article>
                    
                    <ul ref={menuMobileRef} className="menu-mobile">
                        <li><Link className="link-menu" href="https://ormaq.com.br/">INÍCIO</Link></li>
                        <li><Link className="link-menu" href="/">CLASSIFICADOS</Link></li>
                        <li><Link className="link-menu" href="https://ormaq.com.br/sobre-nos/">SOBRE NÓS</Link></li>
                        <li><Link className="link-menu" href="https://ormaq.com.br/servicos/">SERVIÇOS</Link></li>
                        <li><Link className="link-menu" href="https://ormaq.com.br/noticias/">NOTÍCIAS</Link></li>
                        <li><Link className="link-menu" href="https://ormaq.com.br/contato/">CONTATO</Link></li>
                    </ul>
                </nav>
            </section>
        </header>

        <section style={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}} className='title-page'>
            <article>
                <h3>CLASSIFICADOS</h3>
                <p><Link href="/" className='link-voltar'>Ínicio &gt; Classificados &gt; Maquina</Link> &gt; <strong>{maquinaSelecionada ? maquinaSelecionada.maqNome : ""}</strong></p>
            </article>

            <article>
                <Link href={'/'}><FaArrowLeft className='faArrowLeft' style={{ color: '#646464' }}/></Link>
            </article>
        </section>

        {maquinaSelecionada ? (
            <section className="main-container main-container-equipamento main-container-implemento">
                <section className="container-princial">
                    <section className="imagens-equipamento">
                        {/* Exibe a imagem principal */}
                        {imagemPrincipal ? (
                            <article className="imagem-principal">
                                <img src={imagemPrincipal.imgUrl} alt={`Imagem principal da máquina`} />
                            </article>
                        ) : (
                            <p className="carregando">Carregando imagens...</p>
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
                        <article className="detalhes-equipamento">
                            <h4>{maquinaSelecionada ? maquinaSelecionada.maqNome : ""}</h4>
                            <ul className="info-lista">
                                <li><h5>{maquinaSelecionada ? maquinaSelecionada.maqModelo : ""}</h5></li>
                                <li><strong>Ano de Fabricação:</strong> {maquinaSelecionada ? maquinaSelecionada.maqAnoFabricacao : ""}</li>
                                <li><strong>Condição:</strong> {maquinaSelecionada ? maquinaSelecionada.maqTipo : ""}</li>
                            </ul>
                        </article>

                        <article>
                            <p className='preco-venda-equipamento'>R$ {maquinaSelecionada ? maquinaSelecionada.maqPrecoVenda .replace(".", ",") .replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</p>
                        </article>

                        <article className="aluguel-equipamento">
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
                                            <p className='table-footer'>
                                                * Valores sujeitos à negociação
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </article>

                        <section>
                            <Link className='btn-whats' href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                <p style={{ height: 'auto' }}><FaWhatsapp className='faWhatsapp' style={{ color: 'white', height: 'auto'}} /></p>
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

                <section className="mapa">
                    <article className="mapa-endereco">
                        <FaMapMarkerAlt className='faMapMarkerAltMobile' style={{ color: '#c85446' }} />
                        <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP, 19061-145</p>
                    </article>

                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3695.922373789556!2d-51.427536925479025!3d-22.12893521053385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1733405447301!5m2!1spt-BR!2sbr&q=Av.+Luis+Cez%C3%A1rio,+4908"
                        className="mapa-maquina" 
                    >
                    </iframe>
                </section>
            </section>
        ) : (
            <section className="main-container main-container-equipamento">
                {mostrarMensagem ? (
                    <section className="equipamento-nao-encontrado">
                        <article className="nao-encontrado-conteudo">
                            <h2>Máquina Não Encontrada</h2>
                            <p>A máquina que você está tentando visualizar não foi encontrada!</p>
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