import React, { useState } from "react";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import "./SideBarPage.css";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";
import LogoWhite from "../../images/LogoVenturoV.png";
import LogoBlack from "../../images/LogoVenturoBlackV.png";

const { Header, Sider, Content } = Layout;

function SideBarPage({ children }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const LogoTheme = () => (
    <img
      src={darkTheme ? LogoWhite : LogoBlack}
      alt="Logo"
      style={{ maxWidth: collapsed ? 50 : 65, maxHeight: collapsed ? 50 : 65 }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className="SideBar-Sider"
      >
        <div className="DivLogo-Sider">
          <LogoTheme />
        </div>
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>

      <Layout>
        <Header
          style={{
            background: darkTheme ? "#001529" : "#fff",
            padding: 0,
            height: 30,
            alignItems: "center",
            justifyContent: "flex-start",
            display: "flex",
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              color: darkTheme ? "#fff" : "#001529",
            }}
          />
        </Header>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default SideBarPage;
