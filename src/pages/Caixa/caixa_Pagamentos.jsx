import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./caixa_Pagamentos.css";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Caixa_Pagamentos() {
  return (
    <SideBarPage>
      <main>
        <div className="main-titleCxPagamentos">
          <h3>Caixa (Pagamentos)</h3>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Caixa_Pagamentos;
