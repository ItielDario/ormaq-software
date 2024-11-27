'use client'

export default function Home() {
  return (
    <section className="content-main-children">
      <header className="header-classificados">
        <section className="info-classificados">
          <article className="img-logo">
            <img src="/image/logo-ormaq-amarela.png" alt="Logo Ormaq" />
          </article>

          <article className="search">
            <input
              type="text"
              placeholder="Buscar máquinas, peças ou implementos..."
              className="search-bar"
            />

            <article>

            </article>
          </article>

          <article className="quick-links">
            <a href="#favoritos" className="quick-link">Favoritos</a>
            <a href="#contato" className="quick-link">Contato</a>
          </article>
        </section>

        {/* Links de navegação */}
        <article className="links-classificados">
          <section className="tabs">
            {/* <article className={`box-type ${abaAtiva === "locacoes" ? "active" : ""}`} onClick={() => setAbaAtiva("locacoes")}> */}
            <article>
              <p>Máquinas</p>
            </article>

            {/* <article className={`box-type ${abaAtiva === "manutencoes" ? "active" : ""}`} onClick={() => setAbaAtiva("manutencoes")}> */}
            <article>
              <p>Peças</p>
            </article>

            {/* <article className={`box-type ${abaAtiva === "manutencoes" ? "active" : ""}`} onClick={() => setAbaAtiva("manutencoes")}> */}
            <article>
              <p>Implementos</p>
            </article>
          </section>
        </article>
      </header>
    </section>
  );
}