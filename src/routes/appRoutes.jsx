import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/Sidebar";
import FooterComponent from "../components/Footer"; // Importando o Footer
import Header from "../components/Header";
import Dashboard from "../pages/erp/Dashboard";
import DashboardAdmin from "../pages/erp/DashboardAdmin";
import Login from "../pages/Login";
import CadastroEmpresa from "../pages/CadastroEmpresa";
import Caixa_Saida from "../pages/erp/e-mail/Caixa_Saida";
import Caixa_Entrada from "../pages/erp/e-mail/Caixa_Entrada";
import Perfil from "../pages/erp/Perfil/Perfil";
import CadastroFuncionario from "../pages/erp/funcionarios/RegisterFuncionario";
import Cad_produto from "../pages/erp/estoque/cad_produto";
import Despesas from "../pages/erp/financeiro/contaspagar/despesas";
import Fornecedores from "../pages/erp/financeiro/contaspagar/fornecedores";
import Pagamentos from "../pages/erp/financeiro/contaspagar/pagamentos";
import Fluxodecaixa from "../pages/erp/financeiro/contasreceber/fluxodecaixa";
import Receitas from "../pages/erp/financeiro/contasreceber/receitas";
import Cad_imposto from "../pages/erp/financeiro/imposto/cad_imposto";
import Balancete from "../pages/erp/financeiro/planocontas/balancete";
import Dre from "../pages/erp/financeiro/planocontas/dre";
import Razao from "../pages/erp/financeiro/planocontas/razao";
import LanContabil from "../pages/erp/financeiro/planocontas/lancontabil/lancontabil";
import Vendas from "../pages/erp/vendas/vendas";
import GestaoVendas from "../pages/erp/vendas/GestaoDeVendas/gestaoVendas.jsx";
import Abas from "../pages/erp/vendas/GestaoDeVendas/Abas.jsx";
import Cadastronf from "../pages/erp/vendas/notafiscal/cadastronf";
import Clientes from "../pages/erp/vendas/pedidos/clientes";
import Precofinal from "../pages/erp/vendas/pedidos/precofinal";
import Error from "../pages/erro/error";
import Landpage from "../pages/erp/landpage/landpage";
import LogsAdmin from "../pages/erp/LogsAdmin/LogsAdmin";
import LogsEmpresa from "../pages/erp/LogsAdmin/LogsEmpresa.jsx";
import Logout from "../components/Logout";
import Caixa from "../pages/erp/vendas/pedidosEmAberto";
import Caixa_Pagamento from "../pages/erp/vendas/caixa_Pagamento";
import Caixa_Modal from "../pages/erp/vendas/caixa_Modal";
import PlanoDContas from "../pages/erp/financeiro/planocontas/planodecontaspage/planodcontas";

function AppRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <RouteRenderer openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
    </Router>
  );
}

function RouteRenderer({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const isExcludedRoute = ["/", "/error", "/CadastroEmpresa", "/login"].includes(
    location.pathname
  );

  const [userInfo, setUserInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("/api/ServerTwo/verifyToken", {
          withCredentials: true,
        });
        if (response.status === 200) {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else if (response.status === 201) {
          alert("Refresh necessário");
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        }
      } catch (error) {
        console.error("Token inválido", error);
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="grid-container">
      {!isExcludedRoute && (
        <>
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        </>
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<Landpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/E-mail_Caixa_Saida' element={<Caixa_Saida />} />
          <Route path="/E-mail_Caixa_Entrada" element={<Caixa_Entrada />} /> 
          {userInfo?.Status !== "NO" && (
            <>
              <Route path="/logs_admin" element={<LogsAdmin />} />
              <Route path="/logs_empresa" element={<LogsEmpresa />} />
              <Route path="/dashboard_admin" element={<DashboardAdmin />} />
              <Route path="/CadastroFuncionario" element={<CadastroFuncionario />} />
              <Route path="/cad_produto" element={<Cad_produto />} />
              <Route path="/cadastronf" element={<Cadastronf />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/precofinal" element={<Precofinal />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/caixa" element={<Caixa />} />
              <Route path="/caixa_pagamento" element={<Caixa_Pagamento />} />
              <Route path="/caixa_modal" element={<Caixa_Modal />} />
              <Route path="/gestaoPedidos" element={<GestaoVendas />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/fluxodecaixa" element={<Fluxodecaixa />} />
              <Route path="/receitas" element={<Receitas />} />
              <Route path="/cad_imposto" element={<Cad_imposto />} />
              <Route path="/balancete" element={<Balancete />} />
              <Route path="/dre" element={<Dre />} />
              <Route path="/razao" element={<Razao />} />
              <Route path="/lancontabil" element={<LanContabil />} />
              <Route path="*" element={<Navigate to="/error" />} />
              <Route path="/planodcontas" element={<PlanoDContas/>}/> 
              <Route path="/abas" element={<Abas/>}/>
            </>
          )}
          <Route path="/error" element={<Error errorCode={404 || 500} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
    
  );
}

export default AppRoutes;
