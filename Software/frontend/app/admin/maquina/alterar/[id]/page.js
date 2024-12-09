'use client';
export const dynamic = "force-dynamic";
import CriarBotao from "../../../components/criarBotao.js";
import CustomEditor from "../../../components/custom-editor.js"; 
import httpClient from "../../../utils/httpClient.js";
import { useRef, useState, useEffect } from "react";

export default function AlterarMaquina({ params: { id } }) {
  const alertMsg = useRef(null);

  const maqNomeRef = useRef(null);
  const maqDataAquisicaoRef = useRef(null);
  const maqTipoRef = useRef(null);
  const maqModeloRef = useRef(null);
  const maqSerieRef = useRef(null);
  const maqAnoFabricacaoRef = useRef(null);
  const maqHorasUsoRef = useRef(null);
  const maqPrecoVendaRef = useRef(null);
  const maqPrecoAluguelDiarioRef = useRef(null);
  const maqPrecoAluguelSemanalRef = useRef(null);
  const maqPrecoAluguelQuinzenalRef = useRef(null);
  const maqPrecoAluguelMensalRef = useRef(null);
  const maqExibirCatalogoRef = useRef(null);
  const maqStatusRef = useRef(null);
  const [maqDescricao, setMaqDescricao] = useState('');

  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);
  const [maquinaAluguelSelecionada, setMaquinaAluguelSelecionada] = useState(null);
  const [imagens, setImagens] = useState([]); 
  const [imagensBanco, setImagensBanco] = useState([]); 
  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [nomeImagemPrincipal, setNomeImagemPrincipal] = useState(null);

  useEffect(() => {
    carregarMaquina();
  }, []);

  const carregarMaquina = () => {
    httpClient.get(`/maquina/${id}`)
      .then(r => r.json())
      .then(r => {
        r.maquina.maqDataAquisicao = new Date(r.maquina.maqDataAquisicao).toISOString().split('T')[0];

        setMaquinaSelecionada(r.maquina);
        setMaquinaAluguelSelecionada(r.maquinaAluguel);
        setMaqDescricao(r.maquina.maqDescricao);

        // Atualiza imagens no estado
        const imagensBanco = r.imagensMaquina.map(imagem => ({
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
      .catch(error => console.error("Erro ao carregar os dados da máquina:", error));
  };

  const alterarMaquina = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      maqId: id,
      maqNome: maqNomeRef.current.value,
      maqDataAquisicao: maqDataAquisicaoRef.current.value,
      maqTipo: maqTipoRef.current.value,
      maqModelo: maqModeloRef.current.value,
      maqSerie: maqSerieRef.current.value,
      maqAnoFabricacao: maqAnoFabricacaoRef.current.value,
      maqHorasUso: maqHorasUsoRef.current.value,
      maqPrecoVenda: maqPrecoVendaRef.current.value,
      maqPrecoAluguelDiario: maqPrecoAluguelDiarioRef.current.value,
      maqPrecoAluguelSemanal: maqPrecoAluguelSemanalRef.current.value,
      maqPrecoAluguelQuinzenal: maqPrecoAluguelQuinzenalRef.current.value,
      maqPrecoAluguelMensal: maqPrecoAluguelMensalRef.current.value,
      maqExibirCatalogo: maqExibirCatalogoRef.current.value,
      maqStatus: maqStatusRef.current ? maqStatusRef.current.value : maquinaSelecionada.eqpStaId,
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

      // Adicione os campos do formulário
      formData.append("maqId", id);
      formData.append("maqNome", maqNomeRef.current.value);
      formData.append("maqDataAquisicao", maqDataAquisicaoRef.current.value);
      formData.append("maqTipo", maqTipoRef.current.value);
      formData.append("maqModelo", maqModeloRef.current.value);
      formData.append("maqSerie", maqSerieRef.current.value);
      formData.append("maqAnoFabricacao", maqAnoFabricacaoRef.current.value);
      formData.append("maqHorasUso", maqHorasUsoRef.current.value);
      formData.append("maqPrecoVenda", maqPrecoVendaRef.current.value);
      formData.append("maqPrecoAluguelDiario", maqPrecoAluguelDiarioRef.current.value);
      formData.append("maqPrecoAluguelSemanal", maqPrecoAluguelSemanalRef.current.value);
      formData.append("maqPrecoAluguelQuinzenal", maqPrecoAluguelQuinzenalRef.current.value);
      formData.append("maqPrecoAluguelMensal", maqPrecoAluguelMensalRef.current.value);
      formData.append("maqExibirCatalogo", maqExibirCatalogoRef.current.value);
      formData.append("maqStatus", maqStatusRef.current ? maqStatusRef.current.value : maquinaSelecionada.eqpStaId);
      formData.append("maqDescricao", maqDescricao || "");
      formData.append("nomeImagemPrincipal", nomeImagemPrincipal);
      formData.append("imagensBancoExcluir", imagensExcluidasString);
      formData.append("imagensBanco", imagensBancoString);

      // Adicione as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem.file); // `imagem.file` contém o arquivo real
      });

      fetch(`http://129.146.3.119/api/maquina`, {
      // fetch(`http://localhost:5000/api/maquina`, {
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
          if (status == 201) {
            alertMsg.current.className = 'alertSuccess';
            carregarMaquina();
          } else {
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
    setMaqDescricao(data);
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
        <h1>Alterar Máquina</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        {maquinaSelecionada && (
          <>
            <section className="input-group">
            <section>
                <label htmlFor="maqSerie">Série/Chassi da Máquina - Campo de leitura</label>
                <input
                  type="text"
                  id="maqSerie"
                  className="input-estatico"
                  defaultValue={maquinaSelecionada.maqSerie}
                  ref={maqSerieRef}
                  readOnly
                  title="Este campo é somente leitura. Não é possível alterar a Série/Chassi da máquina."
                />
              </section>

              <section>
                <label htmlFor="maqNome">Nome da Máquina</label>
                <input
                  type="text"
                  id="maqNome"
                  defaultValue={maquinaSelecionada.maqNome}
                  ref={maqNomeRef}
                />
              </section>

              <section>
                <label htmlFor="maqModelo">Modelo da Máquina</label>
                <input
                  type="text"
                  id="maqModelo"
                  defaultValue={maquinaSelecionada.maqModelo}
                  ref={maqModeloRef}
                />
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqAnoFabricacao">Ano de Fabricação</label>
                <input
                  type="number"
                  id="maqAnoFabricacao"
                  defaultValue={maquinaSelecionada.maqAnoFabricacao}
                  ref={maqAnoFabricacaoRef}
                />
              </section>

              <section>
                <label htmlFor="maqTipo">Tipo da Máquina</label>
                <select
                  id="maqTipo"
                  defaultValue={maquinaSelecionada.maqTipo}
                  ref={maqTipoRef}
                >
                  <option value="Nova">Nova</option>
                  <option value="Semi-Nova">Semi-Nova</option>
                </select>
              </section>

              <section>
                <label htmlFor="maqDataAquisicao">Data de Aquisição</label>
                <input
                  type="date"
                  id="maqDataAquisicao"
                  defaultValue={maquinaSelecionada.maqDataAquisicao}
                  ref={maqDataAquisicaoRef}
                />
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqPrecoVenda">Preço de Venda</label>
                <input
                  type="number"
                  id="maqPrecoVenda"
                  defaultValue={maquinaSelecionada.maqPrecoVenda}
                  ref={maqPrecoVendaRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqHorasUso">Horas de Uso</label>
                <input
                  type="number"
                  id="maqHorasUso"
                  defaultValue={maquinaSelecionada.maqHorasUso}
                  ref={maqHorasUsoRef}
                />
              </section>

              {(maquinaSelecionada.eqpStaId == 1 || maquinaSelecionada.eqpStaId == 4) && (
                  <section>
                    <label htmlFor="maqStatus">Status da Máquina</label>
                    <select 
                      id="maqStatus" 
                      name="maqStatus" 
                      defaultValue={maquinaSelecionada.eqpStaId} 
                      ref={maqStatusRef} 
                      required
                    >
                      <option value="1">Disponível</option>
                      <option value="4">Vendido</option>
                    </select>
                  </section>
                )}

              <section>
                <label htmlFor="maqExibirCatalogo">Exibir nos classificados</label>
                <select
                  id="maqExibirCatalogo"
                  defaultValue={maquinaSelecionada.maqExibirCatalogo}
                  ref={maqExibirCatalogoRef}
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </section>
            </section>

            <section className="input-group">
              <section>
                <label htmlFor="maqPrecoAluguelDiario">Preço do Aluguel Diário</label>
                <input
                  type="number"
                  id="maqPrecoAluguelDiario"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoDiario}
                  ref={maqPrecoAluguelDiarioRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelSemanal">Preço do Aluguel Semanal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelSemanal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoSemanal}
                  ref={maqPrecoAluguelSemanalRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelQuinzenal">Preço do Aluguel Quinzenal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelQuinzenal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoQuinzenal}
                  ref={maqPrecoAluguelQuinzenalRef}
                  step="0.01"
                />
              </section>

              <section>
                <label htmlFor="maqPrecoAluguelMensal">Preço do Aluguel Mensal</label>
                <input
                  type="number"
                  id="maqPrecoAluguelMensal"
                  defaultValue={maquinaAluguelSelecionada.maqAluPrecoMensal}
                  ref={maqPrecoAluguelMensalRef}
                  step="0.01"
                />
              </section>
            </section>

            <section>
              <label htmlFor="maqDescricao">Descrição da Máquina</label>
              <CustomEditor
                onChange={handleCustomEditorChange}
                initialValue={maqDescricao}
              />
            </section>
          </>
        )}

        <section className="image-upload">
          <label htmlFor="inputImagem">Imagens da Máquina</label>
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

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/admin/maquina' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={alterarMaquina}>Alterar</button>
      </article>
    </section>
  );
}