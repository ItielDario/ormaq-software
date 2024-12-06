export default function AjudaMaquina() {
    return (
      <section className="content-main-children">
        <article className="title-ajuda">
          <h1>Guia de Preenchimento do Formulário de Cadastro de Máquina</h1>
        </article>
  
        <article className="img-ajuda">
          <img src="/image/formulario-cadastrar-maquina.jpg" alt="Formulário de cadastro de máquinas" />
        </article>
  
        <article className="texto-ajuda">
          <h2>1. Nome da Máquina:</h2>
          <p>Insira o nome ou a identificação da máquina. Exemplo: Trator Agrícola X500.</p>
  
          <h2>2. Modelo da Máquina:</h2>
          <p>Digite o modelo exato da máquina. Esse campo ajuda a diferenciar máquinas similares. Exemplo: X500.</p>
  
          <h2>3. Série/Chassi da Máquina:</h2>
          <p>Informe o número de série ou chassi, utilizado para identificar unicamente a máquina. Exemplo: 123456789ABCD.</p>
  
          <h2>4. Ano de Fabricação:</h2>
          <p>Preencha o ano em que a máquina foi fabricada. Exemplo: 2020.</p>
  
          <h2>5. Tipo da Máquina:</h2>
          <p>Selecione, no menu suspenso, a categoria da máquina. Exemplo: Trator, Escavadeira, etc.</p>
  
          <h2>6. Data de Aquisição:</h2>
          <p>Informe a data em que a máquina foi adquirida. Clique no ícone de calendário para selecionar a data. Exemplo: 01/01/2023.</p>
  
          <h2>7. Preço de Venda:</h2>
          <p>Informe o valor pelo qual a máquina está sendo vendida (se aplicável). Use números. Exemplo: 50000.</p>
  
          <h2>8. Horas de Uso:</h2>
          <p>Digite o número total de horas que a máquina foi utilizada. Exemplo: 1500.</p>
  
          <h2>9. Exibir nos Classificados:</h2>
          <p>Escolha "Sim" se deseja que a máquina apareça nos classificados. Caso contrário, escolha "Não".</p>
  
          <h2>10. Preço do Aluguel:</h2>
          <p>Preencha os valores de aluguel nas seguintes categorias:</p>
          <ul>
            <li>Diário: Valor cobrado por dia de uso. Exemplo: 500.</li>
            <li>Semanal: Valor cobrado por semana de uso. Exemplo: 3000.</li>
            <li>Quinzenal: Valor cobrado por 15 dias de uso. Exemplo: 5000.</li>
            <li>Mensal: Valor cobrado por 30 dias de uso. Exemplo: 10000.</li>
          </ul>
  
          <h2>11. Descrição da Máquina:</h2>
          <p>Forneça uma descrição detalhada da máquina, incluindo informações adicionais que possam ser úteis, como o estado de conservação, funcionalidades e acessórios inclusos. Exemplo: Trator agrícola em excelente estado, equipado com ar-condicionado e implementos para aragem.</p>
  
          <h2>12. Imagens da Máquina:</h2>
          <p>Clique no botão "Escolher arquivos" para fazer o upload de imagens da máquina. As imagens ajudam a tornar o anúncio mais atrativo.</p>
  
          <h2>13. Botão "Cadastrar":</h2>
          <p>Após preencher todos os campos corretamente, clique no botão "Cadastrar" para salvar os dados.</p>
  
          <h2>14. Botão "Voltar":</h2>
          <p>Caso deseje retornar à página anterior sem salvar, clique no botão "Voltar".</p>
        </article>
      </section>
    );
  }
  