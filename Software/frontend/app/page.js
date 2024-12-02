'use client';

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import httpClient from "./admin/utils/httpClient.js";
import Link from "next/link";

export default function Home() {

  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosExbir, setEquipamentosExbir] = useState([]);

  // Campos do filtro
  const checkMaquinaRef = useRef(null)
  const checkPecaRef = useRef(null)
  const checkImplementoRef = useRef(null)

  useEffect(() => {
    // Buscando os dados de máquinas, peças e implementos
    Promise.all([
      httpClient.get("/maquina/obter/exibir-classificados").then(r => r.json()),
      httpClient.get("/peca/obter/exibir-classificados").then(r => r.json()),
      httpClient.get("/implemento/obter/exibir-classificados").then(r => r.json())
    ]).then(([maquinas, pecas, implementos]) => {
      // Combinando os dados em uma única lista
      const todosEquipamentos = [...maquinas, ...pecas, ...implementos];
  
      // Ordenando os equipamentos pelo ID, do mais novo para o mais antigo
      const equipamentosOrdenados = todosEquipamentos.sort((a, b) => (b.id || b.maqId || b.pecId || b.impId) - (a.id || a.maqId || a.pecId || a.impId));
  
      // Atualizando o estado com os equipamentos ordenados
      setEquipamentos(equipamentosOrdenados);
      setEquipamentosExbir(equipamentosOrdenados);
    });
  }, []);

  const filtrarEquipamentos = () => {
    console.log(checkMaquinaRef.current.checked)
    
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
                  <input type="checkbox" name="tipo" value="maquina" ref={checkMaquinaRef} onClick={filtrarEquipamentos} style={{ width: 'auto' }}/> 
                  <label style={{ width: 'auto', height: 'auto', margin: '0' }}>Máquinas</label>
                </article>

                <article className='select-tipo'>
                  <input type="checkbox" name="tipo" value="peca" ref={checkPecaRef} onClick={filtrarEquipamentos} style={{ width: 'auto' }}/> 
                  <label style={{ width: 'auto', height: 'auto', margin: '0' }}>Peças</label>
                </article>

                <article className='select-tipo'>
                  <input type="checkbox" name="tipo" value="implemento" ref={checkImplementoRef} onClick={filtrarEquipamentos} style={{ width: 'auto' }}/> 
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
            {equipamentos.map((equipamento) => (
              <article key={equipamento.id || equipamento.maqId || equipamento.pecId || equipamento.impId} className="card-equipamento">
                <section className="img-equipamento">
                  <img src={equipamento.imagemUrl || "/image/sem-imagem.jpg"} alt={'Imagem do equipemento'} />
                </section>

                <section className="dados-equipamentos">
                  <h4 className="nome-equipamento">
                    {equipamento.maqNome}
                  </h4>
                  
                  {/* Renderiza o modelo apenas para máquinas */}
                  {equipamento.maqModelo ? (
                    <h5>{equipamento.maqModelo}</h5>
                  ) : null}

                  {/* Caso não seja máquina, exibe o tipo para implementos e peças */}
                  {!equipamento.maqModelo && (equipamento.pecNome || equipamento.impNome) && (
                    <article className="dados-peca-implemento">
                      <h4 className="nome-equipamento">{equipamento.pecNome || equipamento.impNome}</h4>
                      <h5>{equipamento.pecNome ? "Peça" : "Implemento"}</h5>
                    </article>
                  )}

                  <p>SAIBA MAIS</p>
                </section>
              </article>
            ))}
          </article>

        </section>
      </section>

      <article className="footer">
        <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
      </article>
    </section>
  );
}