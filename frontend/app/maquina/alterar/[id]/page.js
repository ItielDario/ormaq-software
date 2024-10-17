'use client';
import MontarFormulario from "../../../components/montarFormulario.js";
import CriarBotao from "../../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarMaquina({ params: { id } }) {
  const formRef = useRef(null);
  const alertMsg = useRef(null);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  useEffect(() => {
    carregarMaquinas();
  }, []);

  function carregarMaquinas() {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r =>setMaquinaSelecionada(r));
  }

  const alterarMaquina = () => {
    const formElement = formRef.current.getFormElement(); // Obtem os elementos (TAGs) do formulário
    const formData = new FormData(formElement); // Obtem os inputs do formulário
    alertMsg.current.style.display = 'none';
    
    const maqTipoSelect = formElement.querySelector('select[name="maqTipo"]'); // Seleciona o <select> pelo nome
    const maqTipoTexto = maqTipoSelect.selectedIndex >= 0 
    ? maqTipoSelect.options[maqTipoSelect.selectedIndex].text 
    : undefined; // Verifica se existe uma option escolhida no select
  
    const dados = {
      maqId: id,
      maqNome: formData.get('maqNome'), // Obtem o valor do input 'maqNome'
      maqDataAquisicao: formData.get('maqDataAquisicao'),
      maqTipo: maqTipoTexto,
      maqHorasUso: formData.get('maqHorasUso'),
      maqDescricao: formRef.current.getCustomEditorValue() // Obtem o valor do ckeditor 'customEditor'
    };
  
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } else {
      httpClient.put("/maquina", dados)
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
          }, 100);
        });
    }

    document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
  };

  const verificaCampoVazio = (dados) => {
    const camposVazios = Object.values(dados).some(value => value == '' || value == null || value == undefined);
    return camposVazios;
  }

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Alterar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <article className="container-forms">
        {maquinaSelecionada && (
          <MontarFormulario 
            ref={formRef}
            initialValues={maquinaSelecionada} // Passar os dados atuais da máquina
            labelTitle={[
              'Nome da Máquina', 
              'Data de Aquisição', 
              'Tipo da Máquina', 
              'Horas de Uso', 
              'Descrição da Máquina',
            ]} 
            id={[
              'maqNome', 
              'maqDataAquisicao', 
              'maqTipo',
              'maqHorasUso',  
              'maqDescricao',
            ]}
            typeImput={[
              'text', 
              'date', 
              'select',
              'number', 
              'customEditor',
            ]}
            optinsOfSelect={[
              ['Nova', 'Semi-Nova'],   // Opções para "Tipo da Máquina"
            ]}
          />
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarMaquina}>Alterar</button>
      </article>
    </section>
  );
}