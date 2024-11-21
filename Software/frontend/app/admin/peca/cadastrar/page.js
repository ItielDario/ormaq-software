'use client';
import CriarBotao from "../../components/criarBotao.js"; 
import CustomEditor from "../../components/custom-editor.js";
import httpClient from "../../utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarPeca() {
  const pecNomeRef = useRef(null);
  const pecDataAquisicaoRef = useRef(null);
  const pecPrecoVendaRef = useRef(null); 
  const pecPrecoHoraRef = useRef(null); 
  const pecaExibirCatalogoRef = useRef(null);
  const alertMsg = useRef(null);
  const [pecDescricao, setPecDescricao] = useState('');
  const [imagens, setImagens] = useState([]); 
  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [nomeImagemPrincipal, setNomeImagemPrincipal] = useState(null);

  const cadastrarPeca = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      pecaNome: pecNomeRef.current.value,
      pecaDataAquisicao: pecDataAquisicaoRef.current.value,
      pecaPrecoVenda: pecPrecoVendaRef.current.value, 
      pecaPrecoHora: pecPrecoHoraRef.current.value,
      pecaExibirCatalogo: pecaExibirCatalogoRef.current.value,
      pecaDescricao: pecDescricao,
      imagens: imagens,
      nomeImagemPrincipal: nomeImagemPrincipal
    };

    if (imagens.length > 0 && imagemPrincipal == null) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, escolha uma imagem para ser utilizada de capa!'; 
      }, 100);
      document.getElementById('topAnchor').scrollIntoView({ behavior: 'auto' });
      return;
    } 
    
    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha os campos abaixo corretamente!';
      }, 100);
    } 
    else {
      var status = null;
      const formData = new FormData();

      formData.append("pecaNome", pecNomeRef.current.value); 
      formData.append("pecaDataAquisicao", pecDataAquisicaoRef.current.value); 
      formData.append("pecaDescricao", pecDescricao || ""); 
      formData.append("pecaExibirCatalogo", pecaExibirCatalogoRef.current.value); 
      formData.append("pecaPrecoVenda", pecPrecoVendaRef.current.value); 
      formData.append("pecaPrecoHora", pecPrecoHoraRef.current.value);
      formData.append("nomeImagemPrincipal", nomeImagemPrincipal);

      // Adicione as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem.file); // `imagem.file` contém o arquivo real
      });

      console.log(nomeImagemPrincipal)
      
      fetch("http://localhost:5000/peca/cadastrar", {
        method: "POST",
        body: formData
      })
      .then(r => {
          status = r.status;
          return r.json();
      })
        .then(r => {
          setTimeout(() => {
            if(status == 201){
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              pecNomeRef.current.value = '';
              pecDataAquisicaoRef.current.value = '';
              pecPrecoVendaRef.current.value = '';
              pecPrecoHoraRef.current.value = '';
              pecaExibirCatalogoRef.current.value = '0';
              <CustomEditor initialValue={''}/>;
              setImagens([]);
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
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  }

  const handleCustomEditorChange = (data) => {
    setPecDescricao(data);
  };

  const exibirImagem = (e) => {
    const arquivos = Array.from(e.target.files); // Obtém os arquivos selecionados
  
    const novasImagens = arquivos.map((file, index) => ({
      id: index + Date.now(), // ID único
      file, // Arquivo da imagem
      url: URL.createObjectURL(file), // URL temporária para exibição
    }));
  
    setImagens((prev) => [...prev, ...novasImagens]); // Adiciona as novas imagens ao estado
  };

  const selecionarImagemPrincipal = (image) => {
    setImagemPrincipal(image.id); // Define a imagem selecionada como principal
    setNomeImagemPrincipal(image.file.name);
  };

  const excluirImagem = (id) => {
    setImagens(imagens.filter((imagem) => imagem.id !== id));
    
    if (imagemPrincipal === id) {
      setImagemPrincipal(null);
      setNomeImagemPrincipal(null);
    }
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section>
          <label htmlFor="pecNomeRef">Nome da Peça</label>
          <input type="text" id="pecNomeRef" ref={pecNomeRef} />
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="pecDataAquisicao">Data de Aquisição</label>
            <input type="date" id="pecDataAquisicao" ref={pecDataAquisicaoRef} />
          </section>

          <section>
            <label htmlFor="pecPrecoVenda">Preço de Venda</label>
            <input type="number" id="pecPrecoVenda" ref={pecPrecoVendaRef} step="0.01" />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="pecPrecoHora">Preço por Hora</label>
            <input type="number" id="pecPrecoHora" ref={pecPrecoHoraRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="pecInativo">Exibir nos classificados</label>
            <select id="pecInativo" ref={pecaExibirCatalogoRef}>
              <option value="0">Sim</option>
              <option value="1">Não</option>
            </select>
          </section>
        </section>

        <section>
          <label htmlFor="pecDescricao">Descrição da Peça</label>
          <CustomEditor
            onChange={handleCustomEditorChange}
            initialValue={pecDescricao}
          />
        </section>

        <section className="image-upload">
          <label htmlFor="inputImagem">Imagens da Peça</label>
          <input
            className="input-img"
            onChange={exibirImagem}
            type="file"
            id="inputImagem"
            multiple
            accept=".jpg,.png"
          />

          {imagens.length > 0 && (
            <section className="image-table">
              <h2>Imagens Selecionadas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Definir imagem principal</th>
                    <th>Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {imagens.map((imagem) => (
                    <tr key={imagem.id}>
                      <td>
                        <img
                          src={imagem.url}
                          alt="Imagem do produto"
                          className={imagemPrincipal === imagem.id ? "selected" : ""}
                        />
                      </td>
                      <td>
                        <button
                          type="button" // Evita o comportamento padrão de enviar formulário
                          onClick={() => selecionarImagemPrincipal(imagem)}
                          className={imagemPrincipal === imagem.id ? "btn-selected" : "btn-default"}
                        >
                          {imagemPrincipal === imagem.id ? "Selecionada como Capa" : "Selecionar como Capa"}
                        </button>
                      </td>
                      <td>
                        <a onClick={() => excluirImagem(imagem.id)}><i className="nav-icon fas fa-trash"></i></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarPeca}>Cadastrar</button>
      </article>
    </section>
  );
}