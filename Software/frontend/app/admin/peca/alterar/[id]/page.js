'use client';
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarPeca({ params: { id } }) {
  const alertMsg = useRef(null);

  const pecaNomeRef = useRef(null);
  const pecaDataAquisicaoRef = useRef(null);
  const pecaPrecoVendaRef = useRef(null);
  const pecaPrecoHoraRef = useRef(null);
  const pecaExibirCatalogoRef = useRef(null);

  const [pecaDescricao, setPecaDescricao] = useState('');
  const [pecaSelecionada, setPecaSelecionada] = useState(null);
  const [imagens, setImagens] = useState([]); 
  const [imagensBanco, setImagensBanco] = useState([]); 
  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [nomeImagemPrincipal, setNomeImagemPrincipal] = useState(null);

  useEffect(() => {
    carregarPeca();
  }, []);

  function carregarPeca() {
    httpClient.get(`/peca/${id}`)
      .then(r => r.json())
      .then(r => {
        r.peca.pecDataAquisicao = new Date(r.peca.pecDataAquisicao).toISOString().split('T')[0];
        setPecaSelecionada(r.peca);
        setPecaDescricao(r.peca.pecDescricao);

        // Atualiza imagens no estado
        const imagensBanco = r.imagensPeca.map(imagem => ({
          id: imagem.imgId,
          file: { name: imagem.imgNome }, // Criando um objeto `file` para acessar o `name`
          url: imagem.imgUrl,
          principal: imagem.imgPrincipal === 1
        }));
        setImagens(imagensBanco);
        setImagensBanco(imagensBanco)

        // Define imagem principal
        const principal = imagensBanco.find(img => img.principal);
        if (principal) {
          setImagemPrincipal(principal.id);
          setNomeImagemPrincipal(principal.file.name);
        }
      })
      .catch(error => console.error("Erro ao carregar os dados da peça:", error));
  }

  const alterarPeca = () => {
    const dados = {
      pecaId: id,
      pecaNome: pecaNomeRef.current.value,
      pecaDataAquisicao: pecaDataAquisicaoRef.current.value,
      pecaPrecoVenda: pecaPrecoVendaRef.current.value, 
      pecaPrecoHora: pecaPrecoHoraRef.current.value,
      pecaExibirCatalogo: pecaExibirCatalogoRef.current.value,
      pecaDescricao: pecaDescricao,
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

      const imagensExcluidas = imagensBanco.filter(imagemBanco => 
        !imagens.some(imagem => imagem.id === imagemBanco.id)
      );
    
      const imagensBancoString = JSON.stringify(imagensBanco);
      const imagensExcluidasString = JSON.stringify(imagensExcluidas);

      formData.append("pecaId", id); 
      formData.append("pecaNome", pecaNomeRef.current.value); 
      formData.append("pecaDataAquisicao", pecaDataAquisicaoRef.current.value); 
      formData.append("pecaDescricao", pecaDescricao || ""); 
      formData.append("pecaExibirCatalogo", pecaExibirCatalogoRef.current.value); 
      formData.append("pecaPrecoVenda", pecaPrecoVendaRef.current.value); 
      formData.append("pecaPrecoHora", pecaPrecoHoraRef.current.value);
      formData.append("nomeImagemPrincipal", nomeImagemPrincipal);
      formData.append("imagensBancoExcluir", imagensExcluidasString);
      formData.append("imagensBanco", imagensBancoString);

      // Adicione as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem.file); // `imagem.file` contém o arquivo real
      });
      
      fetch("http://localhost:5000/peca", {
        method: "PUT",
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
              carregarPeca()
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
  };

  const handleCustomEditorChange = (data) => {
    setPecaDescricao(data);
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
        <h1>Alterar Peça</h1>
      </article>

      <article ref={alertMsg}></article>

      <article>
        {pecaSelecionada && (
          <article className="container-forms">
            <form>
              <section>
                <label htmlFor="pecaNome">Nome da peça</label>
                <input 
                  type="text" 
                  id="pecaNome" 
                  name="pecaNome" 
                  defaultValue={pecaSelecionada.pecNome} 
                  ref={pecaNomeRef} 
                  required 
                />
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="pecaDataAquisicao">Data de Aquisição</label>
                  <input 
                    type="date" 
                    id="pecaDataAquisicao" 
                    name="pecaDataAquisicao" 
                    defaultValue={pecaSelecionada.pecDataAquisicao} 
                    ref={pecaDataAquisicaoRef} 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="pecaPrecoVenda">Preço de Venda</label>
                  <input 
                    type="number" 
                    id="pecaPrecoVenda" 
                    name="pecaPrecoVenda" 
                    defaultValue={pecaSelecionada.pecPrecoVenda} 
                    ref={pecaPrecoVendaRef} 
                    step="0.01" 
                    required 
                  />
                </section>
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="pecaPrecoHora">Preço por Hora</label>
                  <input 
                    type="number" 
                    id="pecaPrecoHora" 
                    name="pecaPrecoHora" 
                    defaultValue={pecaSelecionada.pecPrecoHora} 
                    ref={pecaPrecoHoraRef} 
                    step="0.01" 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="pecaExibirCatalogo">Exibir nos classificados</label>
                  <select 
                    id="pecaExibirCatalogo" 
                    name="pecaExibirCatalogo" 
                    defaultValue={pecaSelecionada.pecExibirCatalogo} 
                    ref={pecaExibirCatalogoRef} 
                    required
                  >
                    <option value="0">Sim</option>
                    <option value="1">Não</option>
                  </select>
                </section>
              </section>

              <section>
                <label htmlFor="pecaDescricao">Descrição da Peça</label>
                <CustomEditor 
                  onChange={handleCustomEditorChange} 
                  initialValue={pecaDescricao} 
                />
              </section>

              <section className="image-upload">
                <label htmlFor="inputImagem">Imagens da Peça</label>
                <input
                  className="input-img"
                  type="file"
                  id="inputImagem"
                  multiple
                  accept=".jpg,.png"
                  onChange={exibirImagem}
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
                                alt={imagem.nome}
                                className={imagemPrincipal === imagem.id ? "selected" : ""}
                                style={{ width: "100px", height: "auto" }}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
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
          </article>
        )}
      </article>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/peca' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarPeca}>Alterar</button>
      </article>
    </section>
  );
}