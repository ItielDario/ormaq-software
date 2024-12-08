import CriarBotao from "../../components/criarBotao.js";


export default function AjudaPecas() {
    return (
      <section className="content-main-children-ajuda">
        <article className="title-ajuda">
          <h1>Guia de Preenchimento do Formulário de Cadastro de Peças</h1>
        </article>
  
        <article className="img-ajuda">
          <img src="/image/formulario-cadastrar-peca.jpeg" alt="Formulário de cadastro de peças" />
        </article>
  
        <article className="texto-ajuda">
          <h2>1. Nome da Peça:</h2>
          <p>Insira o nome ou a identificação da peça. Exemplo: Ferro de Reposição.</p>
  
          <h2>2. Data de Aquisição:</h2>
          <p>Informe a data em que a peça foi adquirida. Clique no ícone de calendário para selecionar a data. Exemplo: 01/01/2024.</p>
  
          <h2>3. Preço de Venda:</h2>
          <p>Informe o valor pelo qual a peça está sendo vendida. Use números. Exemplo: 1000.</p>

          <h2>4. Preço por Hora:</h2>
          <p>Informe o valor pelo qual a peça está sendo alugada referente a uma hora. Use números. Exemplo: 100.</p>

          <h2>5. Exibir nos Classificados:</h2>
          <p>Escolha "Sim" se deseja que a peça apareça nos classificados. Caso contrário, escolha "Não".</p> 
  
          <h2>6. Descrição da Peça:</h2>
          <p>Forneça uma descrição detalhada da peça, incluindo informações adicionais que possam ser úteis, como o estado de conservação, funcionalidades e acessórios inclusos. Exemplo: Ferro de reposição em excelente estado e pode ser utilizado em diversos tipos de quipamentos.</p>
        
          <h2>7. Imagens da Peça:</h2>
          <p>Clique no botão "Escolher arquivos" para fazer o upload de imagens da peça. As imagens ajudam a tornar o anúncio mais atrativo. </p>
          <p><i>Depois de fazer o upload das imagens é necessário escolher uma imagem para ser usada como capa clicando no botão "Selecionar como Capa".</i></p>
        </article>
        
        <article className="img-ajuda">
          <img src="/image/formulario-alterar-imagens-maquina.jpeg" alt="Formulário de cadastro de peças" />
        </article>
  
        <article className="texto-ajuda">
          <h2>8. Botão "Cadastrar":</h2>
          <p>Após preencher todos os campos corretamente, clique no botão "Cadastrar" para salvar os dados.</p>
  
          <h2>9. Botão "Voltar":</h2>
          <p>Caso deseje retornar à página anterior sem salvar, clique no botão "Voltar".</p>
        </article>

        <aside className="separador">
          <hr></hr>
        </aside>

        <article className="title-ajuda">
          <h1>Observações</h1>
        </article>
        
        <article className="img-ajuda-status">
          <img src="/image/formulario-alterar-status-peca.jpeg" alt="Formulário de cadastro de peças" />
        </article>

        <article className="texto-ajuda">
          <h2>10. Alterar - Status da peça:</h2>
          <p>O campo de Status da Peça na página de Alteração só aparecerá para ser editado se a peça estiver <strong>disponível</strong> ou <strong>vendida</strong>.</p>
        </article>

        <section className="container-btn-ajuda">
          <CriarBotao value='Voltar' href='/admin/peca' class='btn-voltar'></CriarBotao>
        </section>
      </section>
    );
  }
  