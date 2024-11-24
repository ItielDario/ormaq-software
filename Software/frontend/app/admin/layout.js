'use client';
import "./globals.css";
import UserContext from "../context/userContext.js";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RootLayout({ children }) {

  const { user, setUser } = useContext(UserContext); // usuário que vem do contexto que está logado
  let router = useRouter()

  useEffect(() => {
    // Carregar usuário do localStorage
    const localUser = localStorage.getItem('usuario');
    
    if (localUser) {
      setUser(JSON.parse(localUser)); // Atualiza o usuário no contexto
    }
  },  [setUser]);

  const handleLogout = () => {
    // Remover usuário e empresa do localStorage
    fetch('http://localhost:5000/login/logout', {
        mode: 'cors',
        credentials: 'include',
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    }).then(r => r.json());

    localStorage.removeItem('usuario');
    // Atualizar o contexto para remover as informações de user e emp
    setUser(null);
    // Redirecionar o usuário para a página de login ou outra página pública
    router.push('/login');
};

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
        <link rel="stylesheet" href="/css/info.css"/>
        <link rel="stylesheet" href="/css/finalizar.css"/>
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
                  <Link href="/admin/maquina"><li className="itens"><i className="nav-icon fas fa-tractor"></i>Máquinas</li></Link>
                  <Link href="/admin/peca"><li className="itens"><i className="nav-icon fas fa-tools"></i>Peças</li></Link>
                  <Link href="/admin/implemento"><li className="itens"><i className="nav-icon fas fa-cogs"></i>Implementos</li></Link>
                  <Link href="/admin/cliente"><li className="itens"><i className="nav-icon fas fa-address-book"></i>Clientes</li></Link>
                  <Link href="/admin/locacao"><li className="itens"><i className="nav-icon fas fa-truck"></i>Locações</li></Link>
                  <Link href="/admin/manutencao"><li className="itens"><i className="nav-icon fas fa-wrench"></i>Manutenções</li></Link>
                  <Link href="/admin/relatorio"><li className="itens"><i className="nav-icon fas fa-file-alt"></i>Relatórios</li></Link>
                  <Link href="/admin/usuario"><li className="itens"><i className="nav-icon fas fa-user-shield"></i>Usuários</li></Link>
                </article>

                <article>
                  <Link href="/login" onClick={handleLogout} className="itens logout"><i className="nav-icon fas fa-sign-out-alt"></i>Sair</Link>
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
