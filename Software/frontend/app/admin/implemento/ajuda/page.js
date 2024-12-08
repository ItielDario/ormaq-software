import CriarBotao from "../../components/criarBotao.js";


export default function AjudaImplememtos() {
    return (
      <section className="content-main-children-ajuda">
        <article className="title-ajuda">
          <h1>Guia de Preenchimento do Formulário de Cadastro de Implememtos</h1>
        </article>
  
        <article className="img-ajuda">
          <img src="/image/formulario-cadastrar-implemento.jpeg" alt="Formulário de cadastro de implementos" />
        </article>
  
        <article className="texto-ajuda">
          <h2>1. Nome do implemento:</h2>
          <p>Insira o nome ou a identificação do implemento. Exemplo: Pulverizador.</p>
  
          <h2>2. Data de Aquisição:</h2>
          <p>Informe a data em que o implemento foi adquirida. Clique no ícone de calendário para selecionar a data. Exemplo: 01/01/2024.</p>
  
          <h2>3. Preço de Venda:</h2>
          <p>Informe o valor pelo qual o implemento está sendo vendido. Use números. Exemplo: 5000.</p>

          <h2>4. Preço por Hora:</h2>
          <p>Informe o valor pelo qual o implemento está sendo alugado referente a uma hora. Use números. Exemplo: 250.</p>

          <h2>5. Exibir nos Classificados:</h2>
          <p>Escolha "Sim" se deseja que o implemento apareça nos classificados. Caso contrário, escolha "Não".</p> 
  
          <h2>6. Descrição do Implemento:</h2>
          <p>Forneça uma descrição detalhada do implemento, incluindo informações adicionais que possam ser úteis, como o estado de conservação, funcionalidades e acessórios inclusos. Exemplo: Pulverizador em excelente estado e com sisemas de barras.</p>
        
          <h2>7. Imagens da Implemento:</h2>
          <p>Clique no botão "Escolher arquivos" para fazer o upload de imagens do implemento. As imagens ajudam a tornar o anúncio mais atrativo. </p>
          <p><i>Depois de fazer o upload das imagens é necessário escolher uma imagem para ser usada como capa clicando no botão "Selecionar como Capa".</i></p>
        </article>
        
        <article className="img-ajuda">
          <img src="/image/formulario-alterar-imagens-maquina.jpeg" alt="Formulário de cadastro de implementos" />
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
          <img src="/image/formulario-alterar-status-implemento.jpeg" alt="Formulário de cadastro de implementos" />
        </article>

        <article className="texto-ajuda">
          <h2>10. Alterar - Status do Implemento:</h2>
          <p>O campo de Status da Implemento na página de Alteração só aparecerá para ser editado se a implemento estiver <strong>disponível</strong> ou <strong>vendida</strong>.</p>
        </article>

        <section className="container-btn-ajuda">
          <CriarBotao value='Voltar' href='/admin/implemento' class='btn-voltar'></CriarBotao>
        </section>
      </section>
    );
  }
  