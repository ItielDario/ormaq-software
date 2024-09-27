'use client'
import { useState, useRef, useEffect } from "react";

export default function Maquina() {
  
  //funcao pra listar máquinas
  let [listaMaquinas, setlistaMaquinas] = useState([]);
  useEffect((e) => {
      carregarMaquinas();
  }, )

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


    </section>
  );
}
