'use client';

export const forceDynamic = "force-dynamic"; // ou qualquer nome que você preferir
import dynamic from 'next/dynamic';

// Importação dinâmica com ssr: false para carregar apenas no cliente
const CriarBotao = dynamic(() => import("../../components/criarBotao.js"), { ssr: false });
const CustomEditor = dynamic(() => import("../../components/custom-editor.js"), { ssr: false });

import { useRef, useState } from "react";

export default function CadastrarImplemento() {
  const impNomeRef = useRef(null);
  const impDataAquisicaoRef = useRef(null);
  const impPrecoVendaRef = useRef(null); 
  const impPrecoHoraRef = useRef(null); 
  const impExibirCatalogoRef = useRef(null);
  const alertMsg = useRef(null);
  const [impDescricao, setImpDescricao] = useState('');
  const [imagens, setImagens] = useState([]); 
  const [imagemPrincipal, setImagemPrincipal] = useState(null);
  const [nomeImagemPrincipal, setNomeImagemPrincipal] = useState(null);

  const cadastrarImplemento = () => {
    alertMsg.current.style.display = 'none';

    const dados = {
      impNome: impNomeRef.current.value,
      impDataAquisicao: impDataAquisicaoRef.current.value,
      impPrecoVenda: impPrecoVendaRef.current.value, 
      impPrecoHora: impPrecoHoraRef.current.value,
      impExibirCatalogo: impExibirCatalogoRef.current.value,
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

      formData.append("impNome", impNomeRef.current.value); 
      formData.append("impDataAquisicao", impDataAquisicaoRef.current.value); 
      formData.append("impDescricao", impDescricao || ""); 
      formData.append("impExibirCatalogo", impExibirCatalogoRef.current.value); 
      formData.append("impPrecoVenda", impPrecoVendaRef.current.value); 
      formData.append("impPrecoHora", impPrecoHoraRef.current.value);
      formData.append("nomeImagemPrincipal", nomeImagemPrincipal);

      // Adicione as imagens
      imagens.forEach((imagem) => {
        formData.append("imagens", imagem.file); // `imagem.file` contém o arquivo real
      });

      console.log(nomeImagemPrincipal)
      
      fetch("http://129.146.3.119/api/implemento/cadastrar", {
      // fetch("http://localhost:5000/api/implemento/cadastrar", {
        method: "POST",
        body: formData,
        credentials: 'include',
      })
      .then(r => {
          status = r.status;
          return r.json();
      })
        .then(r => {
          setTimeout(() => {
            if(status === 201) {
              alertMsg.current.className = 'alertSuccess';

              // Limpa todos os campos do formulário
              impNomeRef.current.value = '';
              impDataAquisicaoRef.current.value = '';
              impPrecoVendaRef.current.value = '';
              impPrecoHoraRef.current.value = '';
              impExibirCatalogoRef.current.value = '0';
              setImpDescricao('');
              <CustomEditor initialValue={''}/>;
              setImagens([]);
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
        <h1>Cadastrar Implemento</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section>
          <label htmlFor="impNomeRef">Nome do Implemento</label>
          <input type="text" id="impNomeRef" ref={impNomeRef} />
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="impDataAquisicao">Data de Aquisição</label>
            <input type="date" id="impDataAquisicao" ref={impDataAquisicaoRef} />
          </section>

          <section>
            <label htmlFor="impPrecoVenda">Preço de Venda</label>
            <input type="number" id="impPrecoVenda" ref={impPrecoVendaRef} step="0.01" />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="impPrecoHora">Preço por Hora</label>
            <input type="number" id="impPrecoHora" ref={impPrecoHoraRef} step="0.01" />
          </section>

          <section>
            <label htmlFor="impExibirCatalogo">Exibir nos classificados</label>
            <select id="impExibirCatalogo" ref={impExibirCatalogoRef}>
              <option value="1">Sim</option>
              <option value="0">Não</option>
            </select>
          </section>
        </section>

        <section>
          <label htmlFor="impDescricao">Descrição do Implemento</label>
          <CustomEditor 
            onChange={handleCustomEditorChange} 
          />
        </section>

        <section className="image-upload">
          <label htmlFor="inputImagem">Imagens do Implemento</label>
          <input
            className="input-img"
            onChange={exibirImagem}
            type="file"
            id="inputImagem"
            multiple
            accept=".jpg, .png, .jpeg"
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
        <CriarBotao value='Voltar' href='/admin/implemento' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarImplemento}>Cadastrar</button>
      </article>
    </section>
  );
}