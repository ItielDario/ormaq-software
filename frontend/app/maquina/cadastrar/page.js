'use client';
import MontarFormulario from "../../components/montarFormulario.js";
import CriarBotao from "../../components/criarBotao.js";
import { useRef } from "react";

export default function CadastrarMaquina() {
  const formRef = useRef(null);
  const alertMsg = useRef(null);

  const cadastrarMaquina = () => {
    const formElement = formRef.current.getFormElement(); // Obtem os elementos (TAGs) do formulário
    const formData = new FormData(formElement); // Obtem os imputs do formulário
    alertMsg.current.style.display = 'none';
    const dados = [
      formData.get('maqNome'), // Obtem o valor do imput 'maqNome'
      formData.get('maqDataAquisicao'),
      formData.get('maqTipo'),
      formData.get('maqHorasUso'),
      formData.get('equipamentoStatus'),
      formData.get('maqInativo'),
      formRef.current.getCustomEditorValue() // Obtem o valor do ckeditor 'customEditor'
    ]

    if(verificaCampoVazio(dados)){
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha as informações corretamente!';
      }, 100)
    }
    else{
      httpClient.post("maquina/cadastrar", body)
      .then(r=> {
          return r.json();
      })
      .then(r=> {
          console.log(r);
          // if(status == 200) {
  
          // }
          // else{
          //     alert(r.msg);
          // }
          setTimeout(() => {
            alertMsg.current.className = 'alertSuccess';
            alertMsg.current.style.display = 'block';
            alertMsg.current.textContent = 'Máquina cadastrada com sucesso!';
          }, 100)
      })
      
    }

    document.getElementById('topAnchor').scrollIntoView({
      behavior: 'auto',
    });
  };

  const verificaCampoVazio = (dados) => {
    const camposVazios = dados.some(element => element == '');

    if (camposVazios) { return true }
    return false;
  }

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <article className="container-forms">
        <MontarFormulario 
        ref={formRef}
        labelTitle={[
          'Nome da Máquina', 
          'Data de Aquisição', 
          'Tipo da Máquina', 
          'Horas de Uso', 
          'Status do Equipamento', 
          'Inativo', 
          'Descrição da Máquina',
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
          ['Nova', 'Semi-Nova'],   // Opções para "Tipo da Máquina"
          ['Disponível'], // Opções para "Status do Equipamento"
          ['Sim', 'Não'],   // Opções para "Inativo"
        ]}/>
      </article>

      <article className="container-btn-cadastrar">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarMaquina}>Cadastrar</button>
      </article>
    </section>
  );
}
