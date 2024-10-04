'use client'
import { useState } from "react";
import MontarFormulario from "../../components/montarFormulario.js";
import CriarBotao from "../../components/criarBotao.js";

export default function CadastrarMaquina() {
  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Máquina</h1>
      </article>

      <article className="container-forms">
        <MontarFormulario 
        labelTitle={[
          'Nome da Máquina', 
          'Data de Aquisição', 
          'Tipo da Máquina', 
          'Horas de Uso', 
          'Status do Equipamento', 
          'Inativo', 
          'Descrição da Maquina',
        ]} 
        id={[
          'maqNome', 
          'maqDataAquisicao', 
           'maqTipo',
          'maqHorasUso', 
          'equipamentoStatus', 
          'maqInativo', 
          'maqDescricao',
        ]}
        typeImput={[
          'text', 
          'date', 
          'select',
          'number', 
          'select',
          'select',
          'customEditor',
        ]}
        optinsOfSelect={[
          ['Nova', 'Semi-Nova'],
          ['Disponível'], 
          ['Não', 'Sim'],
        ]}/>
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <CriarBotao value='Cadastrar' href='/maquina/cadastrar' class='btn-cadastrar'></CriarBotao>
      </article>
    </section>
  );
}