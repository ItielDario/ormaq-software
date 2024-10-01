'use client'
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MontaTabela from "../components/montaTabela.js";

export default function Maquina() {
  
  //funcao pra listar máquinas
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
          console.log(r)
          console.log(listaMaquinas)
      })
  }

  return (
    <section className="content-main-children">
      <article className="title">
        <h1>Lista de Maquinas</h1>
      </article>

      <article className="container-btn-cadastrar">
        <Link className="btn-cadastrar" href={'/maquina/cadastrar'}>Cadastrar</Link>
      </article>

      <article className="container-table">
        <MontaTabela listaMaquinas={listaMaquinas} cabecalhos={['Inativo', 'Nome', 'Data de Aquisição', 'Tipo', 'Horas de uso', 'Status', 'Ações']}></MontaTabela>
      </article>
    </section>
  );
}
