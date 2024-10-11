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
          </div>
        </form>
      </div>
    </main>
  );
}

export default Cad_Empresa;
