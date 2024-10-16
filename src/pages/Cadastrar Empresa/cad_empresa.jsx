import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./cad_empresa.css";
import InputMask from "react-input-mask";

const Users = [{ id: 1, nome: "Isabella", email: "isa@gmail.com" }];

function Cad_Empresa() {
  const user = Users[0];

  return (
    <main>
      <div className="Container-CadEmp">
        <form className="BoxForms-CadEmp">
          <h2>Formulário de Empresa</h2>
          {/* Parte Geral */}
          <div className="GeralDiv-CadEmp">
            <legend>Geral</legend>
            <div className="Campo-Inscriçao">
              <label>
                Inscrição Estadual:
                <InputMask mask="999.999.999.999" type="text" required />
              </label>
            </div>
          </div>

          {/* Parte Endereço */}
          <div className="EndereçoDiv-CadEmp">
            <legend>Endereço</legend>
            <div className="Campo-Municipio">
              <label>
                Município:
                <InputMask type="text" required />
              </label>
            </div>

            <div className="Campo-Uf">
              <label>
                Uf:
                <InputMask mask="aa" type="text" required />
              </label>
            </div>

            <div className="Campo-Logradouro">
              <label>
                Logradouro:
                <InputMask type="text" required />
              </label>
            </div>

            <div className="Campo-Números">
              <label>
                Números:
                <InputMask mask="9999" type="number" required />
              </label>
            </div>

            <div className="Campo-Cep">
              <label>
                Cep:
                <InputMask mask="99999-999" type="number" required />
              </label>
            </div>

            <div className="Campo-Complemento">
              <label>
                Complemento:
                <InputMask type="text" required />
              </label>
            </div>
          </div>

          {/* Parte Empresa */}
          <div className="EmpresaDiv-CadEmp">
            <legend>Empresa</legend>
            <div className="Campo-Telefone">
              <label>
                Telefone:
                <InputMask mask="(99)99999-9999" type="text" required />
              </label>
            </div>
            <div className="Campo-Cpf">
              <label>
                CPF:
                <InputMask mask="999.999.999-99" type="text" required />
              </label>
            </div>
            <div className="Campo-Rg">
              <label>
                RG:
                <InputMask mask="99.999.999-9" type="text" required />
              </label>
            </div>
            <div className="Campo-Site">
              <label>
                Site:
                <InputMask type="url" required />
              </label>
            </div>
          </div>

          {/* Parte Documentos */}
          <div className="DocumentosDiv-CadEmp">
            <legend>Documentos</legend>
            <div className="Campo-Contrato">
              <label>
                Contrato Social:
                <InputMask type="file" required />
              </label>
            </div>
            <div className="Campo-Requerimento">
              <label>
                Requerimento de Empresário:
                <InputMask type="file" required />
              </label>
            </div>
            <div className="Campo-Certificado">
              <label>
                Certificado MEI:
                <InputMask type="file" required />
              </label>
            </div>
          </div>

          {/* Botão de Enviar */}
          <button className="Enviar-CadEmp" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}

export default Cad_Empresa;
