import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./perfilAdmin.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

const Users = [{ id: 1, nome: "Isabella", email: "isa@gmail.com" }];

function PerfilAdmin() {
  const user = Users[0];

  return (
    <SideBarPage>
      <main>
        <h1 className="Titulo-PerfAdmin">YUIYIUI</h1>

        <div className="Body-PerfAdmin">
          <p>ID: {user.id}</p>
          <p>Nome: {user.nome}</p>
          <p>E-mail: {user.email}</p>
        </div>
      </main>
    </SideBarPage>
  );
}

export default PerfilAdmin;
