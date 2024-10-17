'use client';
import MontarFormulario from "../../components/montarFormulario.js";
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef } from "react";

export default function CadastrarImplemento() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);

  const cadastrarImplemento = () => {
    const formElement = formRef.current.getFormElement(); // Obtem os elementos (TAGs) do formulário
    const formData = new FormData(formElement); // Obtem os imputs do formulário
    alertMsg.current.style.display = 'none';
    
    const dados = {
      impNome: formData.get('implementoNome'), // Obtem o valor do imput 'implementoNome'
      impDataAquisicao: formData.get('implementoDataAquisicao'),
      impDescricao: formRef.current.getCustomEditorValue(), // Obtem o valor do ckeditor 'customEditor'
      impInativo: formData.get('implementoInativo'),
      equipamentoStatus: formData.get('equipamentoStatus'), // Obtem o status do equipamento
    }
  
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } 
    else {
      httpClient.post("/implemento/cadastrar", dados)
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
        <h1>Cadastrar Implemento</h1>
      </article>

      <article ref={alertMsg}></article>

      <article className="container-forms">
        <MontarFormulario 
          ref={formRef}
          labelTitle={[
            'Nome do Implemento', 
            'Data de Aquisição', 
            'Status do Equipamento', 
            'Inativo', 
            'Descrição do Implemento',
          ]} 
          id={[
            'implementoNome', 
            'implementoDataAquisicao', 
            'equipamentoStatus', 
            'implementoInativo', 
            'implementoDescricao',
          ]}
          typeImput={[
            'text', 
            'date', 
            'select',
            'select',
            'customEditor',
          ]}
          optinsOfSelect={[
            ['Disponível', 'Indisponível'], // Opções para "Status do Equipamento"
            ['Sim', 'Não'],   // Opções para "Inativo"
          ]}
        />
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarImplemento}>Cadastrar</button>
      </article>
    </section>
  );
}