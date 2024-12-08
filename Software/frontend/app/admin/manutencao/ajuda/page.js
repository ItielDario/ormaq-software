import CriarBotao from "../../components/criarBotao.js";


export default function AjudaManutencao() {
    return (
        <section className="content-main-children-ajuda">
            <article className="title-ajuda">
                <h1>Guia de Preenchimento dos Formulários de Manutenção</h1>
            </article>

            <article className="img-ajuda">
                <img src="/image/formulario-cadastrar-manutencao.jpeg" alt="Formulário de cadastro de manutenção" />
            </article>

            <article className="texto-ajuda">
                <h2>1. Tipo de Equipamento:</h2>
                <p>Selecione o tipo de equipamento no menu suspenso. Isso é necessário para determinar quais equipamentos estarão disponíveis na próxima etapa.</p>

                <h2>2. Nome do Equipamento:</h2>
                <p>Após escolher o tipo de equipamento, selecione o nome do equipamento no campo correspondente. Caso o tipo de equipamento não seja selecionado, o sistema exibirá um aviso.</p>

                <h2>3. Data de Início da Manutenção:</h2>
                <p>Informe a data em que a manutenção será iniciada. Utilize o ícone de calendário para selecionar a data no formato <strong>dd/mm/aaaa</strong>. Exemplo: 10/12/2024.</p>

                <h2>4. Descrição da Manutenção:</h2>
                <p>Descreva de forma detalhada a manutenção a ser realizada, incluindo informações como o problema identificado e as etapas previstas para resolução.</p>

                <h2>5. Botão "Cadastrar Manutenção":</h2>
                <p>Depois de preencher todos os campos obrigatórios, clique no botão <strong>Cadastrar Manutenção</strong> para salvar os dados no sistema.</p>

                <h2>6. Botão "Voltar":</h2>
                <p>Caso deseje retornar à página anterior sem salvar, clique no botão <strong>Voltar</strong>.</p>
            </article>

            <aside className="separador">
                <hr></hr>
            </aside>

            <article className="title-ajuda">
                <h1>Guia de Finalização de Manutenção</h1>
            </article>

            <article className="img-ajuda">
                <img src="/image/lista-manutencao.jpeg" alt="Formulário de finalização de manutenção" />
            </article>

            <article className="texto-ajuda">
                <h2>1. Finalizar Manutenção:</h2>
                <p>Para finalizar uma manutenção basta clicar no ícone <i className="nav-icon fas fa-clipboard-check"></i>e abrirá uma página flutuante, como essa a seguir.</p>
            </article>

            <article className="img-ajuda">
                <img src="/image/formulario-finalizar-manutencao.jpeg" alt="Formulário de finalização de manutenção" />
            </article>
            

            <article className="texto-ajuda">
                <h2>2. Nome do Equipamento:</h2>
                <p>Este campo exibe o nome do equipamento em manutenção e é apenas para leitura, ou seja, não pode ser alterado.</p>

                <h2>3. Data de Início da Manutenção:</h2>
                <p>Este campo exibe a data de início da manutenção e também é apenas para leitura.</p>

                <h2>4. Data de Término:</h2>
                <p>Informe a data em que a manutenção foi concluída. Utilize o ícone de calendário para selecionar a data no formato <strong>dd/mm/aaaa</strong>. Exemplo: 15/12/2024.</p>

                <h2>5. Observação:</h2>
                <p>Insira uma observação sobre o processo de manutenção ou sobre a conclusão. Este campo é opcional, mas pode ser útil para registrar detalhes adicionais.</p>

                <h2>6. Botão "Finalizar Manutenção":</h2>
                <p>Clique no botão <strong>Finalizar Manutenção</strong> para registrar a conclusão da manutenção no sistema.</p>

                <h2>7. Botão "Cancelar":</h2>
                <p>Caso não deseje salvar as informações, clique no botão <strong>Cancelar</strong> para retornar sem realizar alterações.</p>
            </article>

            <section className="container-btn-ajuda">
                <CriarBotao value='Voltar' href='/admin/manutencao' class='btn-voltar'></CriarBotao>
            </section>
        </section>
    );
}
