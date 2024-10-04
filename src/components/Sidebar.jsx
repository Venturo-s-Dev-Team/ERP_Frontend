import React, { useState } from "react";
import { Layout, Button, theme } from "antd";
import MenuList from "./Menulist";
import ToggleThemeButton from "./ToggleThemeButton";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import LogoWhite from "../images/LogoVenturoV.png"
import LogoBlack from "../images/LogoVenturoBlackV.png"
import FooterComponent from "./Footer.jsx"
import "./Sidebar.css";

const { Header, Sider } = Layout;
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };
  

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const Logo = () => (
    <img
      src={darkTheme ? LogoWhite : LogoBlack}
      alt="Logo"
      style={{ width: 80, height: 80 }}
    />
  );
  
  return (
    <aside className="aside">
      <Layout className="sider">
        <Sider 
          collapsed={collapsed}
          trigger={null}
          theme={darkTheme ? "dark" : "light"}
        >
            <Logo/>
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>

        <Layout>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
        </Layout>
      </Layout>
    </aside>
    
  );
}

export default Sidebar;