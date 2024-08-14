import React, { useState } from 'react';
import "../styles/CadastroEmpresa.css";

function CadastroEmpresa() {
  return (
<div className='container-cadastro'>
  <div className='form-container'>  
    <div className="form-sign-up">
      <h1>Formulário de Empresa</h1>
      <form>
        <fieldset>
          <legend>Geral</legend>
          <label>
            Inscrição Estadual:
            <input
              type="text"
              name="inscricaoEstadual"
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <label>
            Município:
            <input
              type="text"
              name="municipio"
              required
            />
          </label>
          <label>
            UF:
            <input
              type="text"
              name="uf"
              required
              maxLength="2"
            />
          </label>
          <label>
            Logradouro:
            <input
              type="text"
              name="logradouro"
              required
            />
          </label>
          <label>
            Número:
            <input
              type="text"
              name="numero"
              required
            />
          </label>
          <label>
            CEP:
            <input
              type="text"
              name="cep"
              required
            />
          </label>
          <label>
            Complemento:
            <input
              type="text"
              name="complemento"
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Empresa</legend>
          <label>
            Telefone:
            <input
              type="text"
              name="telefone"
            />
          </label>
          <label>
            Site:
            <input
              type="url"
              name="site"
            />
          </label>
          <label>
            Sócio:
            <input
              type="text"
              name="socio"
            />
          </label>
          <label>
            CPF:
            <input
              type="text"
              name="cpf"
            />
          </label>
          <label>
            RG:
            <input
              type="text"
              name="rg"
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Documentos</legend>
          <label>
            Contrato Social:
            <input
              type="file"
              name="contratoSocial"
            />
          </label>
          <label>
            Requerimento de Empresário:
            <input
              type="file"
              name="requerimentoEmpresario"
            />
          </label>
          <label>
            Certificado MEI:
            <input
              type="file"
              name="certificadoMEI"
            />
          </label>
        </fieldset>

        <button type="submit">Enviar</button>
      </form>
    </div>
    </div>
    </div>
  );
}

export default CadastroEmpresa;