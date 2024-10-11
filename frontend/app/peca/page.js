'use client'
import { useState, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Peca() {

  const [listaPeca, setlistaPeca] = useState([]);
  
  useEffect((e) => {
      carregarPeca();
  }, [])

  function carregarPeca() {
      fetch('http://localhost:5000/peca', {
          credentials: "include"
      })
      .then(r => {
          return r.json()
      })
      .then(r => {
        setlistaPeca(r);
        console.log(r)
      })
  }

  return (
    <section className="content-main-children-listar">
      <article className="title">
        <h1>Lista de Peças</h1>
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Cadastrar' href='/peca/cadastrar' class='btn-cadastrar'></CriarBotao>
      </article>

      <article className="container-table">
        <MontarTabela listaMaquinas={listaPeca} cabecalhos={['Inativo', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status', 'Ações']}></MontarTabela>
      </article>
    </section>
  );
}
