"use client";

import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaBars } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import httpClient from "./admin/utils/httpClient.js";
import Link from "next/link";

export default function Home() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [implementos, setImplementos] = useState([]);

  // Referências para os filtros
  const buscarInputRef = useRef(null);
  const precoMaiorInputRef = useRef(null);
  const precoMenorInputRef = useRef(null);
  let selectedValueRef = useRef("Máquinas");
  
  //Auxiliares
  const [semMaquina, setSemMaquina] = useState(false);
  const [semPeca, setSemPeca] = useState(false);
  const [semImplemento, setSemImplemento] = useState(false);
  
  // Referencias de elementos para mobile
  const [menuMobile, setMenuMobile] = useState(true);
  const menuMobileRef = useRef(null);

  useEffect(() => {
    // Carregando os dados de máquinas, peças e implementos
    const fetchEquipamentos = async () => {
      try {
        const [maquinasData, pecasData, implementosData] = await Promise.all([
          httpClient.get("/maquina/obter/exibir-classificados").then((res) => res.json()),
          httpClient.get("/peca/obter/exibir-classificados").then((res) => res.json()),
          httpClient.get("/implemento/obter/exibir-classificados").then((res) => res.json()),
        ]);

        if(maquinasData.length == 0) { setSemMaquina(true) }
        if(pecasData.length == 0) { setSemPeca(true) }
        if(implementosData.length == 0) { setSemImplemento(true) }

        // Atualizando os estados
        setMaquinas(maquinasData);
        setPecas(pecasData);
        setImplementos(implementosData);
        setEquipamentos([...maquinasData]); // Inicialmente, exibe todos os equipamentos
      } 
      catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    fetchEquipamentos();
  }, []);

  const filtrarPorTipo = (equipamentos, tipo) => {
    selectedValueRef.current = tipo; // Atualiza o valor dentro de .current

    return equipamentos.filter((equipamento) => {
        if (tipo === "Máquinas" && equipamento.maqNome) return true;
        if (tipo === "Peças" && equipamento.pecNome) return true;
        if (tipo === "Implementos" && equipamento.impNome) return true;
        return false;
    });
  };

  const filtrarPorNome = (equipamentos, nomeBusca) => {
    if (!nomeBusca) return equipamentos;
  
    return equipamentos.filter((equipamento) =>
      (equipamento.maqNome || equipamento.pecNome || equipamento.impNome)
        .toLowerCase()
        .includes(nomeBusca.toLowerCase())
    );
  };

  const filtrarPorPreco = (equipamentos, precoMin, precoMax) => {
    return equipamentos.filter((equipamento) => {
      const preco = equipamento.maqPrecoVenda || equipamento.pecPrecoVenda || equipamento.impPrecoVenda || 0;
      return preco >= precoMin && preco <= precoMax;
    });
  };

  const ordenarEquipamentos = (equipamentos, criterio) => {
    return [...equipamentos].sort((a, b) => {
      const nomeA = a.maqNome || a.pecNome || a.impNome || "";
      const nomeB = b.maqNome || b.pecNome || b.impNome || "";
      const precoA = a.maqPrecoVenda || a.pecPrecoVenda || a.impPrecoVenda || 0;
      const precoB = b.maqPrecoVenda || b.pecPrecoVenda || b.impPrecoVenda || 0;
  
      switch (criterio) {
        case "maior_preco":
          return precoB - precoA;
        case "menor_preco":
          return precoA - precoB;
        case "a_z":
          return nomeA.localeCompare(nomeB);
        case "z_a":
          return nomeB.localeCompare(nomeA);
        default:
          return 0; // Novidades (ordem original)
      }
    });
  };

  const handleFilterChange = (e) => {
    const formData = new FormData(e.target.form || e.target.closest('form')); // Obtém os dados do formulário
    const tipo = formData.get("tipo-equipamento");
    const nomeBusca = formData.get("nome") || "";
    const precoMin = parseFloat(formData.get("preco-min")) || 0;
    const precoMax = parseFloat(formData.get("preco-max")) || Infinity;
    const ordenacao = formData.get("ordenar");
  
    // Aplica os filtros
    let equipamentosFiltrados = [...maquinas, ...pecas, ...implementos];
  
    equipamentosFiltrados = filtrarPorTipo(equipamentosFiltrados, tipo);
    equipamentosFiltrados = filtrarPorNome(equipamentosFiltrados, nomeBusca);
    equipamentosFiltrados = filtrarPorPreco(equipamentosFiltrados, precoMin, precoMax);
    equipamentosFiltrados = ordenarEquipamentos(equipamentosFiltrados, ordenacao);
  
    setEquipamentos(equipamentosFiltrados);
  };

  const exibirMenu = () => {
    setMenuMobile(!menuMobile)
    menuMobile == true ? menuMobileRef.current.style.display = 'flex' : menuMobileRef.current.style.display = 'none'
  }

  useEffect(() => {  }, [equipamentos]);

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

      <section className='title-page'>
        <h3>CLASSIFICADOS</h3>
        <p>Ínicio  &gt;  Classificados</p>
      </section>

      <section className="main-container main-container-implemento">
        <section className="container-equipamentos">
          <aside className="filtros">
            <form style={{ width: 'auto', height: 'auto', margin: '0' }}>
              {/* Filtro por Tipo */}
              <fieldset>
                <legend>Tipo de Equipamentos</legend>

                <article className="select-tipo">
                  <input className="custom-radio" type="radio" name="tipo-equipamento" value="Máquinas" onChange={handleFilterChange} defaultChecked={true} />
                  <label>Máquinas</label>
                </article>

                <article className="select-tipo">
                  <input className="custom-radio" type="radio" name="tipo-equipamento" value="Peças" onChange={handleFilterChange} />
                  <label>Peças</label>
                </article>

                <article className="select-tipo">
                  <input className="custom-radio" type="radio" name="tipo-equipamento" value="Implementos" onChange={handleFilterChange} />
                  <label>Implementos</label>
                </article>
              </fieldset>

              {/* Ordenação */}
              <label className="legend">
                Listar por:
                <select className='select-input' name="ordenar" onChange={handleFilterChange}>
                  <option value="novidades">Novidades</option>
                  <option value="menor_preco">Menor Preço</option>
                  <option value="maior_preco">Maior Preço</option>
                  <option value="a_z">Nome: A a Z</option>
                  <option value="z_a">Nome: Z a A</option>
                </select>
              </label>

              {/* Filtro por Nome */}
              <label className="legend">
                Busca por Nome:
                <input type="text" name="nome" placeholder="Digite o nome" onChange={handleFilterChange} ref={buscarInputRef} />
              </label>

              {/* Filtro por Preço */}
              <section>
                <legend>Preço</legend>
                <article className="legend input-group-filtro">
                  <article className="input-50">
                    <input type="number" name="preco-min" placeholder="De" onChange={handleFilterChange} ref={precoMaiorInputRef} />
                  </article>
                  -
                  <article className="input-50">
                    <input type="number" name="preco-max" placeholder="Até" onChange={handleFilterChange} ref={precoMenorInputRef} />
                  </article>
                </article>
              </section>
            </form>

          </aside>

          {equipamentos.length > 0 ? (
            <article className="equipamentos">
              {equipamentos.map((equipamento, index) => {
                // Renderiza máquinas
                if (equipamento.maqNome) {
                  return (
                    <article key={equipamento.maqId} className={`card-equipamento ${index}`}>
                      <section className="img-equipamento">
                        <img src={equipamento.imagemUrl || "/image/sem-imagem.jpg"} alt="Imagem do equipamento" />
                      </section>

                      <section className="dados-equipamentos">
                        <section className="dados-maquinas">
                          <h4 className="nome-equipamento">{equipamento.maqNome}</h4>
                          <h5>{equipamento.maqModelo}</h5>
                          <h5>R$ {equipamento.maqPrecoVenda .replace(".", ",") .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                        </section>

                        <Link href={`/maquina/${equipamento.maqId}`}><p>SAIBA MAIS</p></Link>
                      </section>
                    </article>
                  );
                }

                // Renderiza peças
                if (equipamento.pecNome) {
                  return (
                    <article key={equipamento.pecId} className={`card-equipamento ${index}`}>
                      <section className="img-equipamento">
                        <img src={equipamento.imagemUrl || "/image/sem-imagem.jpg"}malt="Imagem do equipamento" />
                      </section>

                      <section className="dados-equipamentos">
                        <article className="dados-peca-implemento">
                          <h4 className="nome-equipamento">{equipamento.pecNome}</h4>
                          <h5>Peça</h5>
                          <h5>R$ {equipamento.pecPrecoVenda.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                        </article>

                        <Link href={`/peca/${equipamento.pecId}`}><p>SAIBA MAIS</p></Link>
                      </section>
                    </article>
                  );
                }

                // Renderiza implementos
                if (equipamento.impNome) {
                  return (
                    <article key={equipamento.impId} className={`card-equipamento ${index}`}>
                      <section className="img-equipamento">
                        <img src={equipamento.imagemUrl || "/image/sem-imagem.jpg"} alt="Imagem do equipamento" />
                      </section>

                      <section className="dados-equipamentos">
                        <article className="dados-peca-implemento">
                          <h4 className="nome-equipamento">{equipamento.impNome}</h4>
                          <h5>Implemento</h5>
                          <h5>R$ {equipamento.impPrecoVenda .replace(".", ",") .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                        </article>

                        <Link href={`/implemento/${equipamento.impId}`}><p>SAIBA MAIS</p></Link>
                      </section>
                    </article>
                  );
                }

                return null;
              })}
            </article>
          ) : (
            <section className="equipamento-nao-encontrado">
              {(semMaquina || semPeca || semImplemento) ? (
                <article className="nao-encontrado-conteudo">
                  <h2>Não há {selectedValueRef.current} Disponíveis</h2>
                  <p>Estamos sem {selectedValueRef.current} disponíveis no momento, mas logo teremos novidades!</p>
                </article>
              ) : (
                <p className="carregando">Carregando...</p>
              )}
            </section>
          )}
        </section>
      </section>

      <section className="mapa-classificados">
        <article className="mapa-endereco">
            <FaMapMarkerAlt className='faMapMarkerAltMobile' style={{ color: '#c85446'}} />
            <p>Av. Luis Cezário, 4908 - Vila Euclides, Pres. Prudente - SP, 19061-145</p>
        </article>

        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3695.922373789556!2d-51.427536925479025!3d-22.12893521053385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1733405447301!5m2!1spt-BR!2sbr&q=Av.+Luis+Cez%C3%A1rio,+4908"
            className="mapa-maquina" 
        >
        </iframe>
      </section>
      
      <article className="footer">
        <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
      </article>
    </section>
  );
}