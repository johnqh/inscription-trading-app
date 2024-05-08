import React, { useState } from "react";
import "./App.css";
import Wallet from "./components/Wallet";
import Market from "./components/Market";
import Nft from "./components/Nft";
import User from "./components/User";
import logo from "./images/Zorro Cat Logo.png";
import MarketIcon from "./components/MarketIcon";
import Home from "./components/Home";

import {
  UserOutlined,
  SettingOutlined,
  TrademarkOutlined,
} from "@ant-design/icons";

import { Layout, Flex, Button, Menu, MenuProps } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#fff",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "1.5em",
  color: "#2B2A29",
  backgroundColor: "#fff",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#5D647B",
  fontFamily: "broadacre-thin-4, sans-serif",
  fontStyle: "normal",
  fontWeight: 100,
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#2B2A29",
  backgroundColor: "#fff",
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
  getItem(<UserOutlined />, "account"),
  getItem(<MarketIcon />, "market"),
  getItem(<TrademarkOutlined />, "nft"),
];

const settingsItems: MenuItem[] = [getItem(<SettingOutlined />, "settings")];

function App() {
  let [accounts, setAccounts] = useState<string[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");
  const [selectedToken, setSelectedToken] = useState(""); // Initially defined in the Market component, we now need to define it here to have tokens on the account page that can link to that specific token's market page.
  const [orderType, setOrderType] = useState("buy");
  const setMenuItem = (item: string) => {
    setSelectedMenuItem(item);
  };

  const componentsSwitch = (key: string) => {
    switch (key) {
      case "home":
        return <Home setMenuItem={setMenuItem}></Home>;
      case "account":
        return (
          <>
            <Wallet accounts={accounts}></Wallet>
            <User
              address={accounts[0]}
              setMenuItem={setMenuItem}
              setSelectedToken={setSelectedToken}
              setOrderType={setOrderType}
            ></User>
          </>
        );
      case "market":
        return (
          <Market
            address={accounts[0]}
            selectedToken={selectedToken}
            setSelectedToken={setSelectedToken}
            orderType={orderType}
            setOrderType={setOrderType}
          ></Market>
        );
      case "nft":
        return <Nft address={accounts[0]}></Nft>;
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
      <Sider width="10%" style={siderStyle}>
        <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
          <a href="/">
            <img id="logo" src={logo} alt="logo"></img>
          </a>

          <Flex justify="space-between" vertical style={{ flexGrow: 1 }}>
            <Menu
              selectedKeys={[selectedMenuItem]}
              mode="inline"
              theme="dark"
              style={{ backgroundColor: "#5D647B" }}
              items={items}
              onClick={(e) => setSelectedMenuItem(e.key)}
            ></Menu>
            <Menu
              mode="inline"
              theme="dark"
              style={{ backgroundColor: "#5D647B" }}
              items={settingsItems}
            ></Menu>
          </Flex>
        </div>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Flex
            style={{ height: "100%", paddingTop: 20 }}
            justify="flex-end"
            align="center"
          >
            <Button
              type="primary"
              style={{ backgroundColor: "#5D647B" }}
              id="wallet"
              onClick={connectWallet}
            >
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
Layout - https://ant.design/components/layout
Popover - https://ant.design/components/popover
Icon - https://ant.design/components/icon
Flex - https://ant.design/components/flex
Menu - https://ant.design/components/menu
Button - https://ant.design/components/button
UniSat Wallet API - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet
Settings Icon on Bottom Menu - https://github.com/ant-design/ant-design/issues/13572
Pass Function as Prop - https://stackoverflow.com/questions/68895112/how-to-pass-function-as-a-prop-in-react-typescript
Sharing State Between Components - https://react.dev/learn/sharing-state-between-components
*/
