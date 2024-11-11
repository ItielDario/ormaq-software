'use client';
import CriarBotao from "../../components/criarBotao.js";
import httpClient from "@/app/utils/httpClient.js";
import { useRef, useState } from "react";

export default function CadastrarCliente() {
  const cliNomeRef = useRef(null);
  const cliCPF_CNPJRef = useRef(null);
  const cliTelefoneRef = useRef(null);
  const cliEmailRef = useRef(null);
  const alertMsg = useRef(null);

  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleCpfCnpjChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setCpfCnpj(mascaraCPF_CNPJ(valor));
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    setTelefone(mascaraTelefone(valor));
  };

  const mascaraCPF_CNPJ = (valor) => {
    if (valor.length <= 11) { // CPF
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else { // CNPJ
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
  };

  const mascaraTelefone = (valor) => {
    if (valor.length <= 10) { // Formato fixo
      return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else { // Formato celular
      return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const cadastrarCliente = () => {
    alertMsg.current.style.display = 'none';
    let status = 0;

    const dados = {
      cliNome: cliNomeRef.current.value,
      cliCPF_CNPJ: cpfCnpj,
      cliTelefone: telefone || 'Sem Telefone',
      cliEmail: cliEmailRef.current.value || 'Sem Email'
    };

    if (verificaCampoVazio(dados)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'Por favor, preencha todos os campos obrigatórios!';
      }, 100);
      return;
    }

    const cpfCnpjNumerico = cpfCnpj.replace(/\D/g, ''); // Remove máscara para validação
    if (!validaCPF(cpfCnpjNumerico) && !validaCNPJ(cpfCnpjNumerico)) {
      setTimeout(() => {
        alertMsg.current.className = 'alertError';
        alertMsg.current.style.display = 'block';
        alertMsg.current.textContent = 'CPF ou CNPJ inválido!';
      }, 100);
      return;
    }

    httpClient.post("/cliente/cadastrar", dados)
      .then((r) => {
        status = r.status;
        return r.json();
      })
      .then((response) => {
        setTimeout(() => {
          console.log(status);
          if (status == 201) {
            alertMsg.current.className = 'alertSuccess';
            limparCampos();
          } else {
            alertMsg.current.className = 'alertError';
          }

          alertMsg.current.style.display = 'block';
          alertMsg.current.textContent = response.msg;
        }, 100);
      });
  };

  const verificaCampoVazio = (dados) => {
    return Object.values(dados).some(value => value === '' || value === null || value === undefined);
  };

  const limparCampos = () => {
    cliNomeRef.current.value = '';
    setCpfCnpj('');
    setTelefone('');
    cliEmailRef.current.value = '';
  };

  const validaCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  };

  const validaCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  };

  return (
    <section className="content-main-children-cadastrar">
      <article className="title">
        <h1>Cadastrar Cliente</h1>
      </article>

      <article ref={alertMsg}></article>

      <form>
        <section className="input-group">
          <section>
            <label htmlFor="cliNome">Nome do Cliente</label>
            <input type="text" id="cliNome" ref={cliNomeRef} />
          </section>

          <section>
            <label htmlFor="cliCPF_CNPJ">CPF/CNPJ</label>
            <input
              type="text"
              id="cliCPF_CNPJ"
              ref={cliCPF_CNPJRef}
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              placeholder="Digite o CPF ou CNPJ"
            />
          </section>
        </section>

        <section className="input-group">
          <section>
            <label htmlFor="cliTelefone">Telefone</label>
            <input
              type="text"
              id="cliTelefone"
              ref={cliTelefoneRef}
              value={telefone}
              onChange={handleTelefoneChange}
              placeholder="(XX) XXXXX-XXXX"
            />
          </section>

          <section>
            <label htmlFor="cliEmail">Email</label>
            <input type="email" id="cliEmail" ref={cliEmailRef} />
          </section>
        </section>
      </form>

      <article className="container-btn">
        <CriarBotao value='Voltar' href='/cliente' class='btn-voltar'></CriarBotao>
        <button type="button" className='btn-cadastrar' onClick={cadastrarCliente}>Cadastrar</button>
      </article>
    </section>
  );
}