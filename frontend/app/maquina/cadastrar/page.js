'use client'
import { useState } from "react";
import MontarFormulario from "../../components/montarFormulario.js";
import CriarBotao from "../../components/criarBotao.js";

export default function CadastrarMaquina() {
  const [descricao, setDescricao] = useState('');

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Máquina</h1>
      </article>

      <article className="container-forms">
        <MontarFormulario descricao={descricao} setDescricao={setDescricao} />
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <CriarBotao value='Cadastrar' href='/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
      </article>
    </section>
  );
}