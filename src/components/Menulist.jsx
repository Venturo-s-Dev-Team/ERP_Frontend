import { Menu } from "antd";
import {
  MoneyCollectOutlined,
  AreaChartOutlined,
  PayCircleOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { MdLogout } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoPieChartSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();

  // Token
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://10.144.170.13:3001/verifyToken', { withCredentials: true });
        const decodedToken = jwtDecode(response.data.token);
        setUserInfo(decodedToken);
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/');
      }
    };
    
    verifyToken();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = [
    {
      key: "Dashboard",
      icon: <IoPieChartSharp />,
      label: "Dashboard",
      onClick: () => handleNavigation("/dashboard"),
    },
    userInfo?.TypeUser === 'SuperAdmin' && {
      key: "DashboardAdmin",
      icon: <IoPieChartSharp />,
      label: "DashboardAdmin",
      onClick: () => handleNavigation("/dashboard_admin"),
    },
    !(userInfo?.Status === 'NO') && {
      key: "subestoque",
      icon: <StockOutlined />,
      label: "Estoque",
      children: [
        {
          key: "registrar",
          label: "Registrar produtos",
          onClick: () => handleNavigation("/cad_produto"),
        },
      ],
    },
    !(userInfo?.Status === 'NO') && {
      key: "financeiro",
      icon: <FaMoneyBillTrendUp />,
      label: "Financeiro",
      children: [
        {
          key: "contaspagar",
          label: "Contas à pagar",
          children: [
            {
              key: "despesas",
              label: "Despesas",
              onClick: () => handleNavigation("/despesas"),
            },
            {
              key: "fornecedores",
              label: "Fornecedores",
              onClick: () => handleNavigation("/fornecedores"),
            },
            {
              key: "pagamentos",
              label: "Pagamentos",
              onClick: () => handleNavigation("/pagamentos"),
            },
          ],
        },
        {
          key: "contasreceber",
          label: "Contas à receber",
          children: [
            {
              key: "fluxo",
              label: "Fluxo de caixa",
              onClick: () => handleNavigation("/fluxodecaixa"),
            },
            {
              key: "receitas",
              label: "Receitas",
              onClick: () => handleNavigation("/receitas"),
            },
          ],
        },
        {
          key: "planoconta",
          label: "Plano conta",
          children: [
            {
              key: "balancete",
              label: "Balancete",
              onClick: () => handleNavigation("/balancete"),
            },
            {
              key: "dre",
              label: "DRE",
              onClick: () => handleNavigation("/dre"),
            },
            {
              key: "razao",
              label: "Razão",
              onClick: () => handleNavigation("/razao"),
            },
          ],
        },
        {
          key: "imposto",
          label: "Imposto",
          children: [
            {
              key: "cadimposto",
              label: "Cadastrar imposto",
              onClick: () => handleNavigation("/cad_imposto"),
            },
            {
              key: "cofins",
              label: "Cofins",
              onClick: () => handleNavigation("/cofins"),
            },
            {
              key: "csll",
              label: "Csll",
              onClick: () => handleNavigation("/csll"),
            },
            {
              key: "icms",
              label: "Icms",
              onClick: () => handleNavigation("/icms"),
            },
            {
              key: "ipi",
              label: "Ipi",
              onClick: () => handleNavigation("/ipi"),
            },
            {
              key: "irpj",
              label: "Irpj",
              onClick: () => handleNavigation("/irpj"),
            },
            {
              key: "iss",
              label: "Iss",
              onClick: () => handleNavigation("/iss"),
            },
            {
              key: "pis",
              label: "Pis",
              onClick: () => handleNavigation("/pis"),
            },
          ],
        },
      ],
    },
    !(userInfo?.Status === 'NO') && {
      key: "vendas",
      icon: <AreaChartOutlined />,
      label: "Vendas",
      children: [
        {
          key: "cadastro",
          label: "Notas Fiscais",
          onClick: () => handleNavigation("/cadastronf"),
        },
        {
          key: "clientes",
          label: "Clientes",
          onClick: () => handleNavigation("/clientes"),
        },
        {
          key: "precofinal",
          label: "Preço final",
          onClick: () => handleNavigation("/precofinal"),
        },
        {
          key: "historicovendas",
          label: "Histórico de Vendas",
          onClick: () => handleNavigation("/vendas"),
        },
      ],
    },
    {
      key: "Logout",
      icon: <MdLogout />,
      label: "Logout",
      onClick: () => handleNavigation("/logout"),
    },
  ];
  
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      className="menu-bar"
      items={menuItems.filter(Boolean)}  // Filtra os itens nulos
    />
  );
}  

export default MenuList;