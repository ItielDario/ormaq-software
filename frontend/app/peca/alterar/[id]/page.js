'use client';
import MontarFormulario from "../../../components/montarFormulario.js";
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarPeca({ params: { id } }) {
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const [pecaSelecionada, setPecaSelecionada] = useState(null);

  useEffect(() => {
    carregarPeca();
  }, []);

  function carregarPeca() {
    httpClient.get(`/peca/${id}`)
      .then(r => r.json())
      .then(r =>{
        r.pecaDataAquisicao = new Date(r.pecaDataAquisicao).toISOString().split('T')[0];
        console.log(r)
        setPecaSelecionada(r)
      });
  }

  const alterarPeca = () => {
    const formElement = formRef.current.getFormElement(); // Obtem os elementos (TAGs) do formulário
    const formData = new FormData(formElement); // Obtem os imputs do formulário
    alertMsg.current.style.display = 'none';
    
    const dados = {
      pecaNome: formData.get('pecaNome'), // Obtem o valor do imput 'pecaNome'
      pecaDataAquisicao: formData.get('pecaDataAquisicao'),
      pecaDescricao: formRef.current.getCustomEditorValue(), // Obtem o valor do ckeditor 'customEditor'
    }
  
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.put("/peca", dados)
      .then((r) => { 
        status = r.status;
        return r.json()}
      )
      .then(r => {
        setTimeout(() => {
          if(status == 201){
            alertMsg.current.className = 'alertSuccess';
          }
          else{
            alertMsg.current.className = 'alertError';
          }

          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = r.msg;
          formElement.reset(); // Limpa todos os campos do formulário
        }, 100);
      });
    }

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const verificaCampoVazio = (dados) => {
    // Itera sobre os valores do objeto 'dados' e verifica se algum campo está vazio
    const camposVazios = Object.values(dados).some(value => value === '' || value === null || value === undefined);
    return camposVazios;
  }

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <article className="container-forms">
        <MontarFormulario 
          ref={formRef}
          initialValues={pecaSelecionada}
          labelTitle={[
            'Nome da Peça', 
            'Data de Aquisição', 
            'Descrição da Peça',
          ]} 
          id={[
            'pecaNome', 
            'pecaDataAquisicao', 
            'pecaDescricao',
          ]}
          typeImput={[
            'text', 
            'date', 
            'customEditor',
          ]}
          customType='pecaDescricao'
        />
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarPeca}>Alterar</button>
      </article>
    </section>
  );
}