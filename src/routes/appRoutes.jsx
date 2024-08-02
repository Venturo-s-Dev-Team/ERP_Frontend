import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/erp/Dashboard";
import Login from "../pages/Login";

// ESTOQUE
import Cad_produto from "../pages/erp/estoque/cad_produto";
import Movimentacoes from "../pages/erp/estoque/movimentacoes";
import Up_produto from "../pages/erp/estoque/up_produto";

// FINANCEIRO
// CONTAS A PAGAR
import Cad_Despesas from "../pages/erp/financeiro/contaspagar/cad_despesas";
import Cad_fornecedor from "../pages/erp/financeiro/contaspagar/cad_fornecedor";
import Despesas from "../pages/erp/financeiro/contaspagar/despesas";
import Fornecedores from "../pages/erp/financeiro/contaspagar/fornecedores";
import Pagamentos from "../pages/erp/financeiro/contaspagar/pagamentos";

// CONTAS A RECEBER
import Fluxodecaixa from "../pages/erp/financeiro/contasreceber/fluxodecaixa";
import Receitas from "../pages/erp/financeiro/contasreceber/receitas";

// IMPOSTO
import Cad_imposto from "../pages/erp/financeiro/imposto/cad_imposto";
import Cofins from "../pages/erp/financeiro/imposto/cofins";
import Csll from "../pages/erp/financeiro/imposto/csll";
import Icms from "../pages/erp/financeiro/imposto/icms";
import Ipi from "../pages/erp/financeiro/imposto/ipi";
import Irpj from "../pages/erp/financeiro/imposto/irpj";
import Iss from "../pages/erp/financeiro/imposto/iss";
import Pis from "../pages/erp/financeiro/imposto/pis";

// PLANOCONTAS
import Balancete from "../pages/erp/financeiro/planocontas/balancete";
import Dre from "../pages/erp/financeiro/planocontas/dre";
import Razao from "../pages/erp/financeiro/planocontas/razao";

// VENDAS
import Vendas from "../pages/erp/vendas/vendas";

// NOTAFISCAL
import Cadastronf from "../pages/erp/vendas/notafiscal/cadastronf";
import Emissaonf from "../pages/erp/vendas/notafiscal/emissaonf";

// PEDIDOS
import Cad_cliente from "../pages/erp/vendas/pedidos/cad_cliente";
import Clientes from "../pages/erp/vendas/pedidos/clientes";
import Precofinal from "../pages/erp/vendas/pedidos/precofinal";

function AppRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Router>
      <RouteRenderer
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
    </Router>
  );
}

function RouteRenderer({ openSidebarToggle, OpenSidebar }) {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/";

  return (
    <div className="grid-container">
      {!isLoginRoute && (
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cad_produto" element={<Cad_produto />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/up_produto" element={<Up_produto />} />
          <Route path="/cadastronf" element={<Cadastronf />} />
          <Route path="/emissaonf" element={<Emissaonf />} />
          <Route path="/cad_cliente" element={<Cad_cliente />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/precofinal" element={<Precofinal />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/cad_despesas" element={<Cad_Despesas />} />
          <Route path="/cad_fornecedor" element={<Cad_fornecedor />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/fluxodecaixa" element={<Fluxodecaixa />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/cad_imposto" element={<Cad_imposto />} />
          <Route path="/cofins" element={<Cofins />} />
          <Route path="/csll" element={<Csll />} />
          <Route path="/icms" element={<Icms />} />
          <Route path="/ipi" element={<Ipi />} />
          <Route path="/irpj" element={<Irpj />} />
          <Route path="/iss" element={<Iss />} />
          <Route path="/pis" element={<Pis />} />
          <Route path="/balancete" element={<Balancete />} />
          <Route path="/dre" element={<Dre />} />
          <Route path="/razao" element={<Razao />} />
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;
