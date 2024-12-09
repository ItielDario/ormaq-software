
'use client';
export const dynamic = "force-dynamic";
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js";
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarImplemento({ params: { id } }) {
  const alertMsg = useRef(null);

  const impNomeRef = useRef(null);
  const impDataAquisicaoRef = useRef(null);
  const impPrecoVendaRef = useRef(null);
  const impPrecoHoraRef = useRef(null);
  const impExibirCatalogoRef = useRef(null);
  const impStatusRef = useRef(null);

  const [impDescricao, setImpDescricao] = useState('');
  const [implementoSelecionado, setImplementoSelecionado] = useState(null);
  const [imagens, setImagens] = useState([]); 
  const [imagensBanco, setImagensBanco] = useState([]); 
  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [nomeImagemPrincipal, setNomeImagemPrincipal] = useState(null);


  useEffect(() => {
    carregarImplemento();
  }, []);

  function carregarImplemento() {
    httpClient.get(`/implemento/${id}`)
      .then(r => r.json())
      .then(r => {
        r.implemento.impDataAquisicao = new Date(r.implemento.impDataAquisicao).toISOString().split('T')[0];
        setImplementoSelecionado(r.implemento);
        setImpDescricao(r.implemento.impDescricao);

        // Atualiza imagens no estado
        const imagensBanco = r.imagensImplemento.map(imagem => ({
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

  const alterarImplemento = () => {
    const dados = {
      impId: id,
      impNome: impNomeRef.current.value,
      impDataAquisicao: impDataAquisicaoRef.current.value,
      impPrecoVenda: impPrecoVendaRef.current.value,
      impPrecoHora: impPrecoHoraRef.current.value,
      impExibirCatalogo: impExibirCatalogoRef.current.value,
      impStatus: impStatusRef.current ? impStatusRef.current.value : implementoSelecionado.impStatus,
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

      formData.append("impId", id); 
      formData.append("impNome", impNomeRef.current.value); 
      formData.append("impDataAquisicao", impDataAquisicaoRef.current.value); 
      formData.append("impDescricao", impDescricao || ""); 
      formData.append("impExibirCatalogo", impExibirCatalogoRef.current.value); 
      formData.append("impStatus", impStatusRef.current ? impStatusRef.current.value : implementoSelecionado.impStatus); 
      formData.append("impPrecoVenda", impPrecoVendaRef.current.value); 
      formData.append("impPrecoHora", impPrecoHoraRef.current.value);
      formData.append("nomeImagemPrincipal", nomeImagemPrincipal);
      formData.append("imagensBancoExcluir", imagensExcluidasString);
      formData.append("imagensBanco", imagensBancoString);

      // Adicione as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem.file); // `imagem.file` contém o arquivo real
      });
      
      fetch("http://129.146.3.119/api/implemento", {
      // fetch("http://localhost:5000/api/implemento", {
        method: "PUT",
        body: formData,
        credentials: 'include',
      })
      .then(r => {
          status = r.status;
          return r.json();
      })
        .then(r => {
          setTimeout(() => {
            if (status === 200) {
              alertMsg.current.className = 'alertSuccess';
              carregarImplemento();
            } 
            else {
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
    setImpDescricao(data);
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
        <h1>Alterar Implemento</h1>
      </article>

      <article ref={alertMsg}></article>

      <article>
        {implementoSelecionado && (
          <article className="container-forms">
            <form>
              <section>
                <label htmlFor="impNome">Nome do Implemento</label>
                <input 
                  type="text" 
                  id="impNome" 
                  name="impNome" 
                  defaultValue={implementoSelecionado.impNome} 
                  ref={impNomeRef} 
                  required 
                />
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="impDataAquisicao">Data de Aquisição</label>
                  <input 
                    type="date" 
                    id="impDataAquisicao" 
                    name="impDataAquisicao" 
                    defaultValue={implementoSelecionado.impDataAquisicao} 
                    ref={impDataAquisicaoRef} 
                    required 
                  />
                </section>

                <section>
                  <label htmlFor="impPrecoVenda">Preço de Venda</label>
                  <input 
                    type="number" 
                    id="impPrecoVenda" 
                    name="impPrecoVenda" 
                    defaultValue={implementoSelecionado.impPrecoVenda} 
                    ref={impPrecoVendaRef} 
                    step="0.01" 
                    required 
                  />
                </section>
              </section>

              <section className="input-group">
                <section>
                  <label htmlFor="impPrecoHora">Preço por Hora</label>
                  <input 
                    type="number" 
                    id="impPrecoHora" 
                    name="impPrecoHora" 
                    defaultValue={implementoSelecionado.impPrecoHora} 
                    ref={impPrecoHoraRef} 
                    step="0.01" 
                    required 
                  />
                </section>

                {(implementoSelecionado.eqpStaId == 1 || implementoSelecionado.eqpStaId == 4) && (
                  <section>
                    <label htmlFor="impStatus">Status do Implemento</label>
                    <select 
                      id="impStatus" 
                      name="impStatus" 
                      defaultValue={implementoSelecionado.eqpStaId} 
                      ref={impStatusRef} 
                      required
                    >
                      <option value="1">Disponível</option>
                      <option value="4">Vendido</option>
                    </select>
                  </section>
                )}

                <section>
                  <label htmlFor="impExibirCatalogo">Exibir nos classificados</label>
                  <select 
                    id="impExibirCatalogo" 
                    name="impExibirCatalogo" 
                    defaultValue={implementoSelecionado.impExibirCatalogo} 
                    ref={impExibirCatalogoRef} 
                    required
                  >
                    <option value="1">Sim</option>
                    <option value="0">Não</option>
                  </select>
                </section>
              </section>

              <section>
                <label htmlFor="impDescricao">Descrição do Implemento</label>
                <CustomEditor 
                  onChange={handleCustomEditorChange} 
                  initialValue={impDescricao} 
                />
              </section>

              <section className="image-upload">
                <label htmlFor="inputImagem">Imagens do Implemento</label>
                <input
                  className="input-img"
                  type="file"
                  id="inputImagem"
                  multiple
                  accept=".jpg, .png, .jpeg"
                  onChange={exibirImagem}
                />

                {imagens.length > 0 && (
                  <section className="image-table">
                    <h2 className="title-image-table">Imagens Selecionadas</h2>
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
        <CriarBotao value='Voltar' href='/admin/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-alterar' onClick={alterarImplemento}>Alterar</button>
      </article>
    </section>
  );
}