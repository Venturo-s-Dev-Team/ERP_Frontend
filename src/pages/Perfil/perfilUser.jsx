import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./perfilUser.css";
import logoImage from "./img.png";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const Users = [
  { id: 1, nome: "Isabella", empresa: "Isabilas", email: "isa@gmail.com" },
];

function PerfilUser() {
  const user = Users[0];

  return (
    <SideBarPage>
      <main>
        <h1 className="Titulo-PerfUser">Perfil</h1>
        <div className="Body-PerfUser">
          <footer className="Footer-PerfUser">
            <summary className="Summary-PerfUser">
              <img src={logoImage} style={{ width: 270, height: 270 }} />
            </summary>
            <div className="DadosPerfil-PerfUser">
              <h2>Dados do Perfil</h2>
              <p>ID: {user.id}</p>
              <p>Nome: {user.nome}</p>
              <p>Empresa: {user.empresa}</p>
              <p>E-mail: {user.email}</p>
            </div>
          </footer>
        </div>
      </main>
    </SideBarPage>
  );
}

export default PerfilUser;
