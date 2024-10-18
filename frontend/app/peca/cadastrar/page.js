'use client';
import MontarFormulario from "../../components/montarFormulario.js";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef } from "react";

export default function CadastrarPeca() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);

  const cadastrarPeca = () => {
    const formElement = formRef.current.getFormElement(); // Obtem os elementos (TAGs) do formulário
    const formData = new FormData(formElement); // Obtem os imputs do formulário
    alertMsg.current.style.display = 'none';
    
    const dados = {
      pecaNome: formData.get('pecaNome'), // Obtem o valor do imput 'pecaNome'
      pecaDataAquisicao: formData.get('pecaDataAquisicao'),
      pecaDescricao: formRef.current.getCustomEditorValue(), // Obtem o valor do ckeditor 'customEditor'
      pecaInativo: formData.get('pecaInativo'),
      equipamentoStatus: formData.get('equipamentoStatus'), // Obtem o status do equipamento
    }
  
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.post("/peca/cadastrar", dados)
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
        <h1>Cadastrar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <article className="container-forms">
        <MontarFormulario 
          ref={formRef}
          labelTitle={[
            'Nome da Peça', 
            'Data de Aquisição', 
            'Status do Equipamento', 
            'Inativo', 
            'Descrição da Peça',
          ]} 
          id={[
            'pecaNome', 
            'pecaDataAquisicao', 
            'equipamentoStatus', 
            'pecaInativo', 
            'pecaDescricao',
          ]}
          typeImput={[
            'text', 
            'date', 
            'select',
            'select',
            'customEditor',
          ]}
          optinsOfSelect={[
            ['Disponível'], // Opções para "Status do Equipamento"
            ['Sim', 'Não'],   // Opções para "Inativo"
          ]}
        />
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarPeca}>Cadastrar</button>
      </article>
    </section>
  );
}