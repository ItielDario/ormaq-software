'use client'
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Maquina() {
  
  //funcao pra listar máquinas
  

  return (
    <section className="content-main-children">
      <article className="title">
        <h1>Cadastrar Máquina</h1>
      </article>

      <article>

      </article>

      <article className="container-btn-cadastrar">
        <Link className="btn-cadastrar" href={'/maquina'}>Voltar</Link>
        <Link className="btn-cadastrar" href={'/maquina/cadastrar'}>Cadastrar</Link>
      </article>
    </section>
  );
}
