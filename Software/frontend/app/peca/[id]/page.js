'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaArrowLeft, FaBars } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import httpClient from '../../admin/utils/httpClient.js';
import Link from 'next/link';
import React from 'react';

export default function ExibirPeca({ params: { id } }) {

    const [pecaSelecionada, setPecaSelecionada] = useState(null);
    const [pecaImagensSelecionada, setPecaImagensSelecionada] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState(null);
    const [mostrarMensagem, setMostrarMensagem] = useState(false);

    // Referencias de elementos para mobile
    const [menuMobile, setMenuMobile] = useState(true);
    const menuMobileRef = useRef(null);

    useEffect(() => {
        httpClient.get(`/peca/obter/exibir-classificados/${id}`)
        .then(r => r.json())
        .then(r => {
            r.peca.pecDataAquisicao = new Date(r.peca.pecDataAquisicao).toISOString().split('T')[0];

            if (r.imagensPeca.length === 0) {
                r.imagensPeca = [{
                    imgUrl: '/image/sem-imagem.jpg',
                    imgPrincipal: 1
                }];
            }

            setPecaSelecionada(r.peca);
            setPecaImagensSelecionada(r.imagensPeca);
            setImagemPrincipal(r.imagensPeca.find(img => img.imgPrincipal === 1));

            console.log(r);
        })
        .catch(error => {
            console.error("Erro ao carregar os dados da peça:", error)
            setMostrarMensagem(true);
        });
    }, [id]);

    const alterarImagemPrincipal = (imagem) => {
        setImagemPrincipal(imagem);
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
                                <FaBars className='faBars' style={{ color: 'white' }} />
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
                    <p><Link href="/" className='link-voltar'>Ínicio &gt; Classificados &gt; Peça</Link> &gt; <strong>{pecaSelecionada ? pecaSelecionada.pecNome : ""}</strong></p>
                </article>

                <article>
                    <Link href={'/'}><FaArrowLeft className='faArrowLeft' style={{ color: '#646464' }}/></Link>
                </article>
            </section>

            {pecaSelecionada ? (
                <section className="main-container main-container-equipamento">
                    <section className="container-princial">
                        <section className="imagens-equipamento">

                            {imagemPrincipal ? (
                            <article className="imagem-principal">
                                <img src={imagemPrincipal.imgUrl} alt={`Imagem principal da peça`} />
                            </article>
                            ) : (
                                <p className="carregando">Carregando imagens...</p>
                            )}

                            <section className="container-todas-imagens">
                                {pecaImagensSelecionada && pecaImagensSelecionada.map((imagem, index) => (
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
                                <h4>{pecaSelecionada ? pecaSelecionada.pecNome : ""}</h4>
                                <ul className="info-lista">
                                    <li>Em estoque</li>
                                </ul>
                            </article>

                            <article>
                                <p className='preco-venda-equipamento'>R$ {pecaSelecionada ? pecaSelecionada.pecPrecoVenda.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}</p>
                            </article>

                            <section>
                                <Link className='btn-whats' href="https://api.whatsapp.com/send/?phone=5518996946604&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                    <p><FaWhatsapp className='faWhatsapp' style={{ color: 'white' }} /></p>
                                    <p>ENVIAR MENSAGEM</p>
                                </Link>
                            </section>

                            <section className="mapa mapa-display">
                                <article style={{marginTop: '0vw'}} className="mapa-endereco">
                                    <FaMapMarkerAlt className='faMapMarkerAltMobile' style={{ color: '#c85446' }} />
                                    <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP</p>
                                </article>

                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3695.922373789556!2d-51.427536925479025!3d-22.12893521053385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1733405447301!5m2!1spt-BR!2sbr&q=Av.+Luis+Cez%C3%A1rio,+4908"
                                    className="mapa-peca-equipamento" 
                                >
                                </iframe>
                            </section>
                        </section>
                    </section>

                    <section className='descricao-equipemanto'>
                        <article className='title-descricao'>
                            <h4>Detalhes da Peça</h4>
                        </article>

                        <article className="title-descricao">
                            {pecaSelecionada && (
                                <article className='decricao-dados' dangerouslySetInnerHTML={{ __html: pecaSelecionada.pecDescricao }} />
                            )}
                        </article>
                    </section>

                    <section className="mapa-mobile">
                        <article style={{marginTop: '0vw'}} className="mapa-endereco">
                            <FaMapMarkerAlt className='faMapMarkerAltMobile' style={{ color: '#c85446' }} />
                            <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP</p>
                        </article>

                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3695.922373789556!2d-51.427536925479025!3d-22.12893521053385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1733405447301!5m2!1spt-BR!2sbr&q=Av.+Luis+Cez%C3%A1rio,+4908"
                            className="mapa-peca-equipamento" 
                        >
                        </iframe>
                    </section>
                </section>
            ) : (
                <section className="main-container main-container-equipamento">
                    {mostrarMensagem ? (
                        <section className="equipamento-nao-encontrado">
                            <article className="nao-encontrado-conteudo">
                                <h2>Peça Não Encontrada</h2>
                                <p>A peça que você está tentando visualizar não foi encontrada!</p>
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