import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./verMais.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";


function verMais() {
  return (
    <SideBarPage>
      <main>

        <div className="scroll-despesas">
          <div className="Container-VerMais">
          <h1>Nome da Empresa</h1>
          <h3>Inscrição Estadual: </h3>
          <h3>Site: </h3>
          <h3>Munícipio: </h3>
          <h3>CEP: </h3>
          <h3>Logradouro: </h3>
          <h3>Uf:</h3>
          <h3>Números: </h3>
          <h3>Complemento: </h3>
          <h3>Telefone:</h3>
          <h3>CPF:</h3>
          <h3>RG:</h3>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default verMais;
