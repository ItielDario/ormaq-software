'use client'
import { useState, useRef, useEffect } from "react";
import MontarTabela from "../components/montarTabela.js";
import CriarBotao from "../components/criarBotao.js";

export default function Maquina() {

  const [listaMaquinas, setlistaMaquinas] = useState([]);
  
  useEffect((e) => {
      carregarMaquinas();
  }, [])

  function carregarMaquinas() {
      fetch('http://localhost:5000/maquina', {
          credentials: "include"
      })
      .then(r => {
          return r.json()
      })
      .then(r => {
          setlistaMaquinas(r);
      })
  }

  return (
    <section className="content-main-children-listar">
      <article className="title">
        <h1>Lista de Maquinas</h1>
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Cadastrar' href='/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
      </article>

      <article className="container-table">
        <MontarTabela listaMaquinas={listaMaquinas} cabecalhos={['Inativo', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status', 'Ações']}></MontarTabela>
      </article>
    </section>
  );
}
