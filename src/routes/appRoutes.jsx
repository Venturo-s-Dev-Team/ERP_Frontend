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
import Perfil_User from "../pages/Perfil/perfilUser";
import Fornecedores from "../pages/Fornecedores/fornecedores";
import Pagamentos from "../pages/Pagamentos/pagamentos";
import Perfil_Admin from "../pages/Perfil/perfilAdmin";
import Cad_Empresa from "../pages/Cadastrar Empresa/cad_empresa";
import CadastroFuncionario from "../pages/Registrar Funcionário/registrarFuncionario";
import SideBarPage from "../components/Sidebar/SideBarPage";
import Despesas from "../pages/Despesas/despesas";
import FluxoCaixa from "../pages/Fluxo de Caixa/fluxodecaixa";
import Receitas from "../pages/Receitas/receitas";
import Dre from "../pages/Dre/dre";
import NotaFiscal from "../pages/Nota Fiscal/notafiscal";

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
        <Route path="/perfil_user" element={<Perfil_User />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/perfil_admin" element={<Perfil_Admin />} />
        <Route path="/cad_empresa" element={<Cad_Empresa />} />
        <Route path="/funcionarios" element={<CadastroFuncionario />} />
        <Route path="/SideBarPage" element={<SideBarPage />} />
        <Route path="/despesas" element={<Despesas />} />
        <Route path="/fluxocaixa" element={<FluxoCaixa />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/dre" element={<Dre />} />
        <Route path="/notafiscal" element={<NotaFiscal />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
