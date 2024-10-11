'use client'
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Implemento() {

  const [listaImplemento, setlistaImplemento] = useState([]);
  
  useEffect((e) => {
      carregarImplemento();
  }, [])

  function carregarImplemento() {
      fetch('http://localhost:5000/implemento', {
          credentials: "include"
      })
      .then(r => {
          return r.json()
      })
      .then(r => {
        setlistaImplemento(r);
        console.log(r)
      })
  }

  return (
    <section className="content-main-children-listar">
      <article className="title">
        <h1>Lista de Implementos</h1>
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Cadastrar' href='/implemento/cadastrar' class='btn-cadastrar'></CriarBotao>
      </article>

      <article className="container-table">
        <MontarTabela listaMaquinas={listaImplemento} cabecalhos={['Inativo', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status', 'Ações']}></MontarTabela>
      </article>
    </section>
  );
}
