import CriarBotao from "../../components/criarBotao.js";

export default function AjudaLocacao() {
    return (
        <section className="content-main-children-ajuda">
            <article className="title-ajuda">
                <h1>Guia de Preenchimento dos Formulários de Locação</h1>
            </article>

            <article className="img-ajuda">
                <img src="/image/formulario-cadastrar-locacao.png" alt="Formulário de cadastro de locação" />
            </article>

            <article className="texto-ajuda">
                <h2>1. Cliente (Nome / CPF / CNPJ):</h2>
                <p>Informe o nome, CPF ou CNPJ do cliente. Utilize o botão de "+" ao lado do campo caso precise cadastrar um novo cliente antes de continuar.</p>

                <h2>2. Data de Início da Locação:</h2>
                <p>Selecione a data em que a locação começa utilizando o ícone de calendário. Certifique-se de informar no formato <strong>dd/mm/aaaa</strong>. Exemplo: 06/12/2024.</p>

                <h2>3. Data de Término da Locação:</h2>
                <p>Selecione a data em que a locação terminará. Este campo também utiliza o formato <strong>dd/mm/aaaa</strong>.</p>

                <h2>4. Itens da Locação:</h2>
                <p>No campo "Série / Chassi da Máquina", digite ou selecione a série ou o chassi da máquina que será locada. Clique no botão <strong>Adicionar Item</strong> para incluir a máquina na tabela abaixo.</p>

                <h2>5. Desconto:</h2>
                <p>Informe o valor de desconto, caso aplicável, no campo apropriado. O valor total será ajustado automaticamente.</p>

                <h2>6. Botão "Cadastrar Locação":</h2>
                <p>Depois de preencher todos os campos obrigatórios, clique no botão <strong>Cadastrar Locação</strong> para salvar os dados no sistema.</p>

                <h2>7. Botão "Voltar":</h2>
                <p>Caso deseje retornar à página anterior sem salvar, clique no botão <strong>Voltar</strong>.</p>
            </article>

            <aside className="separador">
                <hr></hr>
            </aside>

            <article className="title-ajuda">
                <h1>Guia de Finalização de Locação</h1>
            </article>

            <article className="img-ajuda">
                <img src="/image/lista-locacao.png" alt="Formulário de finalização de locação" />
            </article>

            <article className="texto-ajuda">
                <h2>1. Finalizar Locação:</h2>
                <p>Para finalizar uma locação basta clicar no ícone <i className="nav-icon fas fa-clipboard-check"></i>e abrirá uma página, como essa a seguir.</p>
            </article>

            <article className="img-ajuda">
                <img src="/image/formulario-finalizar-locacao.png" alt="Formulário de finalização de locação" />
            </article>

            <article className="texto-ajuda">
                <h2>1. Dados da Locação:</h2>
                <p>Verifique as informações da locação, como cliente, datas de início e entrega esperada, valor final e descontos aplicados. Estes campos são apenas para leitura.</p>

                <h2>2. Data de Término:</h2>
                <p>Informe a data efetiva de término da locação utilizando o formato <strong>dd/mm/aaaa</strong>.</p>

                <h2>3. Valor de Hora Extra:</h2>
                <p>Insira o valor de horas extras, caso aplicável. Este valor será adicionado ao valor final da locação.</p>

                <h2>4. Atualização de Horas de Uso das Máquinas:</h2>
                <p>No campo abaixo de cada máquina, informe o número atualizado de horas de uso da máquina. O sistema validará as informações.</p>

                <h2>5. Botão "Finalizar Locação":</h2>
                <p>Clique no botão <strong>Finalizar Locação</strong> para registrar a conclusão da locação no sistema.</p>

                <h2>6. Botão "Voltar":</h2>
                <p>Caso deseje retornar sem salvar as alterações, clique no botão <strong>Voltar</strong>.</p>
            </article>

            <section className="container-btn-ajuda">
                <CriarBotao value='Voltar' href='/admin/locacao' class='btn-voltar'></CriarBotao>
            </section>
        </section>
    );
}
