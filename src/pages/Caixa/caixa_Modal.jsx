import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixa_Modal.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Caixa_Modal() {
  return (
    <SideBarPage>
      <main>
        <div className="main-titleCxModal">
          <h3>Caixa (Modal)</h3>
        </div>

        <div className="Valor-CxModal">
          <h1> Valor Total: R$</h1>
        </div>

        <div className="Valor-CxModal">
          <input
            type="number"
            className="Input-CxModal"
            placeholder="Digite o valor recebido"
          />

          <h2 className="H2-CxModal">Troco: R$</h2>
        </div>

        <div>
          <p>Cliente:</p>
          <p>CPF/CNPJ:</p>
          <p>Forma de pagamento:</p>
        </div>
        <button className="Btn-CxModal">Finalizar</button>
      </main>
    </SideBarPage>
  );
}

export default Caixa_Modal;
