import { Menu } from "antd";
import {
  MoneyCollectOutlined,
  AreaChartOutlined,
  PayCircleOutlined,
  StockOutlined,
} from "@ant-design/icons";
import { MdLogout, MdOutlineMailOutline } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoPieChartSharp } from "react-icons/io5";
import { RiContactsBook3Fill } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const MenuList = ({ darkTheme }) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://192.168.1.75:3002/verifyToken', { withCredentials: true });
        
        if (typeof response.data.token === 'string') {
          const decodedToken = jwtDecode(response.data.token);
          setUserInfo(decodedToken);
        } else {
          console.error('Token não é uma string:', response.data.token);
          navigate('/login');
        }
      } catch (error) {
        console.error('Token inválido', error);
        navigate('/login');
      }
    };
    
    verifyToken();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isRestricted = userInfo?.Status === 'NO';
  const isSuperAdmin = userInfo?.TypeUser === 'SuperAdmin';

  const menuItems = [
    isSuperAdmin && {
      key: "dashboard_admin",
      icon: <IoPieChartSharp />,
      label: "Dashboard Admin",
      onClick: () => handleNavigation("/dashboard_admin"),
    },
    isSuperAdmin && {
      key: "logs_admin",
      icon: <RiContactsBook3Fill />,
      label: "Logs Admin",
      onClick: () => handleNavigation("/logs_admin"),
    },
    !isRestricted && !isSuperAdmin && {
      key: "Dashboard",
      icon: <IoPieChartSharp />,
      label: "Dashboard",
      onClick: () => handleNavigation("/dashboard"),
    },
    {
      key: 'Caixa_Entrada',
      icon: <MdOutlineMailOutline />,
      label: "E-mail",
      onClick: () => handleNavigation("/E-mail_Caixa_Entrada"),
    },
    {
      key: 'Perfil',
      icon: <RxAvatar />,
      label: 'Perfil',
      onClick: () => handleNavigation("/Perfil"),
    },
    !isRestricted && !isSuperAdmin && {
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
    !isRestricted && !isSuperAdmin && {
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
    !isRestricted && !isSuperAdmin && {
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
      items={menuItems.filter(Boolean)} // Filtra os itens nulos
    />
  );
}

export default MenuList;