import React, { useState, useEffect } from "react";
import "./App.css";
import Wallet from "./components/Wallet";
import Market from "./components/Market";
import User from "./components/User";
import logo from "./images/Zorro Cat Logo.png";

import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

import { Layout, Flex, Button, Menu, MenuProps } from "antd";
// import "antd/dist/antd.css";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "1.5em",
  color: "#fff",
  backgroundColor: "#0958d9",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Account", "account", <PieChartOutlined />),
  getItem("Market", "market", <DesktopOutlined />),
];

function App() {
  let [accounts, setAccounts] = useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Account");

  const componentsSwitch = (key: string) => {
    console.log(key);
    switch (key) {
      case "account":
        return <>
          <Wallet accounts={accounts}></Wallet>
          <User address={accounts[0]}></User>
        </>
        ;
      case "market":
        return <Market></Market>;
      default:
        break;
    }
  };

  async function connectWallet() {
    try {
      let alertMsg =
        "You don't have the UniSat Wallet Extension installed.\nYou need to download this extension on the Google Chrome web store to interact with this website.";

      // Verifies if the User is Running a Browser with the UniSat Wallet Extension
      if (typeof (window as any).unisat === "undefined") return alert(alertMsg);

      setAccounts(await (window as any).unisat.requestAccounts());
    } catch (e) {
      console.log("connect failed");
    }
  }

  return (
    <Layout style={layoutStyle}>
      <Sider width="25%" style={siderStyle}>
        <img id="logo" src={logo} alt="logo"></img>

        <Menu
          selectedKeys={[selectedMenuItem]}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
          onClick={(e) => setSelectedMenuItem(e.key)}
        ></Menu>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Flex style={{ height: "100%" }} justify="flex-end" align="center">
            <Button type="primary" id="wallet" onClick={connectWallet}>
              Connect
            </Button>
          </Flex>
        </Header>
        <Content style={contentStyle}>
          {componentsSwitch(selectedMenuItem)}
        </Content>
        <Footer style={footerStyle}></Footer>
      </Layout>
    </Layout>
  );
}

export default App;

/*
-------------------- References --------------------
Ant Design - https://ant.design/
*/
