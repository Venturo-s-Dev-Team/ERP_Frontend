import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Landpage from "../pages/LandPage/landpage";
import Login from "../pages/Login/Login";
import Balancete from "../pages/Balancete/balancete";
import Home from "../pages/Dashboard/dashboard";
import HomeAdmin from "../pages/Dashboard Admin/dashboardAdmin";
import RegistroProduto from "../pages/Estoque/cad_produto";
import Error from "../pages/Error/Erros";
import Caixa_Entrada from "../pages/Email/caixaEntrada";
import Caixa_Saida from "../pages/Email/caixaSaida";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="login" element={<Login />} />
        <Route path="/balancete" element={<Balancete />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/dashboardAdmin" element={<HomeAdmin />} />
        <Route path="/cad_produtos" element={<RegistroProduto />} />
        <Route path="/error" element={<Error />} />
        <Route path="email_entrada" element={<Caixa_Entrada />} />
        <Route path="/email_saida" element={<Caixa_Saida />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
