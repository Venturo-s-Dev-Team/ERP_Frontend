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
import AbasForUpdate from "../pages/erp/vendas/GestaoDeVendas/AbasForUpdate.jsx"
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

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userInfo, setUserInfo] = useState(null);
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
        navigate("/login"); // Redireciona para login se token for inválido
      }
    };

    verifyToken();
  }, [navigate]);

  if (!userInfo) {
    return <div>Carregando...</div>;
  }

  return allowedRoles.includes(userInfo.TypeUser) ? (
    children
  ) : (
    <Navigate to="/error" />
  );
};


function RouteRenderer({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const isExcludedRoute = ["/", "/error", "/CadastroEmpresa", "/login"].includes(
    location.pathname
  );


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
          <Route path='/E-mail_Caixa_Saida' element={<Caixa_Saida />} />
          <Route path="/E-mail_Caixa_Entrada" element={<Caixa_Entrada />} />

                    {/* Rotas com permissões específicas */}
                    <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Gestor', 'Gerente', 'Socio', 'Financeiro']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Apenas SuperAdmin pode acessar logs_admin */}
          <Route
            path="/logs_admin"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <LogsAdmin />
              </ProtectedRoute>
            }
          />

          {/* Gestor e Socio podem acessar logs_empresa */}
          <Route
            path="/logs_empresa"
            element={
              <ProtectedRoute allowedRoles={['Gestor', 'Gerente', 'Socio']}>
                <LogsEmpresa />
              </ProtectedRoute>
            }
          />

          {/* Apenas SuperAdmin pode acessar dashboard_admin */}
          <Route
            path="/dashboard_admin"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          {/* Caixa, Gestor e Socio têm acesso às rotas de caixa */}
          <Route
            path="/caixa"
            element={
              <ProtectedRoute allowedRoles={['Caixa', 'Gestor', 'Socio']}>
                <Caixa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa_pagamento"
            element={
              <ProtectedRoute allowedRoles={['Caixa', 'Gestor', 'Socio']}>
                <Caixa_Pagamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa_modal"
            element={
              <ProtectedRoute allowedRoles={['Caixa', 'Gestor', 'Socio']}>
                <Caixa_Modal />
              </ProtectedRoute>
            }
          />

          {/* Estoque, Gestor e Socio podem acessar cad_produto */}
          <Route
            path="/cad_produto"
            element={
              <ProtectedRoute allowedRoles={['Estoque', 'Gestor', 'Socio']}>
                <Cad_produto />
              </ProtectedRoute>
            }
          />

          {/* Gestor, Venda, Socio podem acessar gestaoPedidos */}
          <Route
            path="/gestaoPedidos"
            element={
              <ProtectedRoute allowedRoles={['Gestor', 'Gerente', 'Venda', 'Socio']}>
                <GestaoVendas />
              </ProtectedRoute>
            }
          />

          {/* Socio, Gestor, Venda podem acessar vendas */}
          <Route
            path="/vendas"
            element={
              <ProtectedRoute allowedRoles={['Socio', 'Gestor', 'Venda']}>
                <Vendas />
              </ProtectedRoute>
            }
          />

          {/* Socio, Gestor, Venda podem acessar fornecedores e clientes */}
          <Route
            path="/fornecedores"
            element={
              <ProtectedRoute allowedRoles={['Socio', 'Gestor', 'Venda']}>
                <Fornecedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute allowedRoles={['Socio', 'Gestor', 'Venda']}>
                <Clientes />
              </ProtectedRoute>
            }
          />

          {/* Socio e Gestor podem acessar CadastroFuncionario */}
          <Route
            path="/CadastroFuncionario"
            element={
              <ProtectedRoute allowedRoles={['Socio', 'Gestor']}>
                <CadastroFuncionario />
              </ProtectedRoute>
            }
          />

          {/* Financeiro, Socio, Gestor podem acessar despesas, pagamentos, balancete, lacontabil, dre, planoscontas, receitas, razao */}
          <Route
            path="/despesas"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Despesas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamentos"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Pagamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/balancete"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Balancete />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lancontabil"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <LanContabil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dre"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Dre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planodcontas"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <PlanoDContas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receitas"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Receitas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/razao"
            element={
              <ProtectedRoute allowedRoles={['Financeiro', 'Socio', 'Gestor']}>
                <Razao />
              </ProtectedRoute>
            }
          />

          {/* Gestor, Socio, Financeiro e Caixa podem acessar fluxodecaixa */}
          <Route
            path="/fluxodecaixa"
            element={
              <ProtectedRoute allowedRoles={['Gestor', 'Gerente', 'Socio', 'Financeiro', 'Caixa']}>
                <Fluxodecaixa />
              </ProtectedRoute>
            }
          />

          {/* Venda, Socio e Gestor podem acessar Abas */}
          <Route
            path="/abas"
            element={
              <ProtectedRoute allowedRoles={['Venda', 'Socio', 'Gestor']}>
                <Abas />
              </ProtectedRoute>
            }
          />

                    {/* Venda, Socio e Gestor podem acessar AbasForUpdate */}
                    <Route
            path="/abasForUpdate"
            element={
              <ProtectedRoute allowedRoles={['Venda', 'Socio', 'Gestor']}>
                <AbasForUpdate />
              </ProtectedRoute>
            }
          />

              <Route path="/cadastronf" element={<Cadastronf />} />
              <Route path="/precofinal" element={<Precofinal />} />
              <Route path="*" element={<Navigate to="/error" />} />
          <Route path="/error" element={<Error errorCode={404 || 500} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
    
  );
}

export default AppRoutes;
