import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8"/> 
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Painel Administrativo</title>
        
        
        {/*FONT*/}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>

        {/*ICONS*/}
        <link rel="icon" type="image/x-icon" href="/image/logo-ormaq-amarela.png"></link>
        <link href="/css/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"/>

        {/*CSS*/}
        <link rel="stylesheet" href="/css/layout.css"/>
        <link rel="stylesheet" href="/css/listar.css"/>
        <link rel="stylesheet" href="/css/cadastrar.css"/>
      </head>

      <body className={``}>
        <div id="topAnchor" style={{ position: 'relative', top: 0, height: 0 }}></div> {/* Âncora no topo */}
        
        <header>
          <section className="container-header">
            <figure>
              <img src="/image/logo-ormaq-amarela.png"></img>
            </figure>

            <nav>
              <ul className="itens-nav">
                <article>
                  <a href="/"><li className="itens"><i className="nav-icon fas fa-home"></i>Home</li></a>
                  <a href="/maquina"><li className="itens"><i className="nav-icon fas fa-tractor"></i>Máquinas</li></a>
                  <a href="/peca"><li className="itens"><i className="nav-icon fas fa-tools"></i>Peças</li></a>
                  <a href="/implemento"><li className="itens"><i className="nav-icon fas fa-cogs"></i>Implementos</li></a>
                  <a href="/implemento"><li className="itens"><i className="nav-icon fas fa-address-book"></i>Clientes</li></a>
                  <a href="/locacao"><li className="itens"><i className="nav-icon fas fa-truck"></i>Locações</li></a>
                  <a href="/manutencao"><li className="itens"><i className="nav-icon fas fa-wrench"></i>Manutenções</li></a>
                  <a href="/relatorio"><li className="itens"><i className="nav-icon fas fa-file-alt"></i>Relatórios</li></a>
                  <a href="/usuario"><li className="itens"><i className="nav-icon fas fa-user-shield"></i>Usuários</li></a>
                </article>

                <article>
                  <li className="itens logout"><i className="nav-icon fas fa-sign-out-alt"></i>Sair</li>
                </article>
              </ul>
            </nav>
          </section>
        </header>

        <main>
          <article className="top-bar">
            
          </article>

          <section className="container-main">
            <section className="content-main">
              {children}

              <article className="footer">
                <p>© 2024 ORMAQ. Todos os direitos reservados.</p>
              </article>
            </section>
          </section>
        </main>
      </body>
    </html>
  );
}
