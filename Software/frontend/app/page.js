'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import Link from "next/link";

export default function Home() {
  const equipamentos = [
    { id: 1, nome: "Escavadeira", imagem: "/image/escavadeira.jpg", descricao: "Modelo X, potência 200HP" },
    { id: 2, nome: "Trator Agrícola", imagem: "/image/trator.jpg", descricao: "Trator Y, ideal para plantio" },
    { id: 3, nome: "Betoneira", imagem: "/image/betoneira.jpg", descricao: "Capacidade 500L" },
  ];

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
        <p>Ínicio  &gt;  Classificados</p>
      </section>

      <section className="main-container">
        <section className="container-equipamentos">
          <aside className="filtros">
            <form style={{ width: 'auto', height: 'auto', margin: '0' }}>
              {/* Filtro por Tipo */}
              <fieldset>
                <legend>Tipo</legend>

                <article className='select-tipo'>
                  <input type="checkbox" name="tipo" value="maquina" style={{ width: 'auto' }}/> 
                  <label style={{ width: 'auto', height: 'auto', margin: '0' }}>Máquinas</label>
                </article>

                <article className='select-tipo'>
                  <input type="checkbox" name="tipo" value="peca" style={{ width: 'auto' }}/> 
                  <label style={{ width: 'auto', height: 'auto', margin: '0' }}>Peças</label>
                </article>

                <article className='select-tipo'>
                  <input type="checkbox" name="tipo" value="implemento" style={{ width: 'auto' }}/> 
                  <label style={{ width: 'auto', height: 'auto', margin: '0' }}>Implementos</label>
                </article>
              </fieldset>

              {/* Ordenação */}
              <label className='legend'>
                Listar por:
                <select name="ordenar">
                  <option value="novidades">Novidades</option>
                  <option value="maior_preco">Maior Preço</option>
                  <option value="menor_preco">Menor Preço</option>
                  <option value="a_z">Nome: A a Z</option>
                  <option value="z_a">Nome: Z a A</option>
                </select>
              </label>

              {/* Filtro por Nome */}
              <label className='legend'>
                Busca por Nome:
                <input type="text" name="nome" placeholder="Digite o nome" />
              </label>

              {/* Filtro por Preço */}
              <section>
                <legend>Preço</legend>

                <article className='legend input-group-filtro'>
                  <article className='input-50'>
                    <input type="number" name="preco" placeholder="De" />
                  </article>
                  -
                  <article className='input-50'>
                    <input type="number" name="preco" placeholder="Até" />
                  </article>
                </article>                
              </section>
            </form>
          </aside>

          <article className="equipamentos">
            <article className="card-equipamento">
              <section className="img-equipamento">
                <img src="https://i.ytimg.com/vi/yYxiXY8_bFY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDWa0DqSYOHScbc0fS4GqoTLsG71g" />
              </section>

              <section className="dados-equipamentos">
                <h4 className="nome-equipamento">Escavadeira Anfíbia 35ton AIZM</h4>
                <h5>John Deere 6110B</h5>
                <p>R$ 320.000,00</p>
              </section>
            </article>

            <article className="card-equipamento">
              <section className="img-equipamento">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimW3RXYSyH_EmTICrXzU2dKB4p7RGFPPgEJHiE32goe2IAv_2ZYnPe6tXNM9BR6VGyGG3rD2c711C0f8fMITnVWo2V-hRhs36JlGQDQFOVr5wYiX8_4Xk72k2B4AVfrtwQuLDIZmjiJT4/s1600/Muito+esquisito.jpg" />
              </section>

              <section className="dados-equipamentos">
                <h4 className="nome-equipamento">Escavadeira Anfíbia 35ton AIZM</h4>
                <h5>John Deere 6110B</h5>
                <p>R$ 320.000,00</p>
              </section>
            </article>

            <article className="card-equipamento">
              <section className="img-equipamento">
                <img src="https://i.ytimg.com/vi/lIPFbPAJ5oI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB56WJG6RT3_zV1_eS30P7rCpgGlQ" />
              </section>

              <section className="dados-equipamentos">
                <h4 className="nome-equipamento">Escavadeira Anfíbia 35ton AIZM</h4>
                <h5>John Deere 6110B</h5>
                <p>R$ 320.000,00</p>
              </section>
            </article>

            <article className="card-equipamento">
              <section className="img-equipamento">
                <img src="https://i.ytimg.com/vi/Y6Y4J0E2oHg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBR4BwvvNp4A2W04wP144vMKayqIQ" />
              </section>

              <section className="dados-equipamentos">
                <h4 className="nome-equipamento">Escavadeira Anfíbia 35ton AIZM</h4>
                <h5>John Deere 6110B</h5>
                <p>R$ 320.000,00</p>
              </section>
            </article>
          </article>
        </section>
      </section>

      <article className="footer">
        <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
      </article>
    </section>
  );
}