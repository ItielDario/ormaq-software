'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import httpClient from "../../admin/utils/httpClient.js";
import Link from "next/link";

export default function ExibirMaquina({ params: { id } }) {

  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [maquinaAluguelSelecionada, setMaquinaAluguelSelecionada] = useState(null);


  useEffect(() => {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        r.maquina.maqDataAquisicao = new Date(r.maquina.maqDataAquisicao).toISOString().split('T')[0];

        setMaquinaSelecionada(r.maquina);
        setMaquinaAluguelSelecionada(r.maquinaAluguel);

        console.log(r)
      })
      .catch(error => console.error("Erro ao carregar os dados da máquina:", error));
    
  }, []);

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
            <p>Ínicio &gt; Classificados &gt; Maquina &gt; </p>
        </section>

        <section className="main-container">
            
        </section>
    </section>
  );
}