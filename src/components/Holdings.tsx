import { useState, useEffect } from "react";
import { Card, List, ConfigProvider, Space } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import axios from "axios"; // HTTP requests

export type Holding = {
  tick: string;
  address: string;
  amt: number;
  updated_at_block: number;
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <FrownOutlined style={{ fontSize: 20 }} />
    <p>No holdings</p>
  </div>
);

let unisat = (window as any).unisat;

function Holdings({ holdings }: { holdings: Holding[] }) {
  const [totalTokens, setTotalTokens] = useState(0);
  const [inscriptions, setInscriptions] = useState({
    list: Array(0),
    total: 0,
  });
  const [tick, setTick] = useState<any[]>([]);

  async function getSummary() {
    const elements = [];
    let tokens = 0;

    for (let token of holdings) {
      console.log(token);
      elements.push(
        <div>
          <span>
            <a style={{ color: "inherit" }} href="/">
              {token.tick}: {token.amt}
            </a>
          </span>
        </div>
      );
      tokens += token.amt;
    }

    console.log(elements);
    console.log(tokens);
    setTick(elements);
    setTotalTokens(tokens);
  }

  useEffect(() => {
    // setTotalTokens(holdings.reduce((total, holding) => total + holding.amt, 0));

    getSummary();

    // Get User's List of Inscriptions
    async function getAccountsInscriptions() {
      try {
        setInscriptions(await unisat.getInscriptions());
        // console.log("INSCRIPTIONS: ", inscriptions);

        if (inscriptions.list.length === 0) {
          console.log("YOU HAVE NO INSCRIPTIONS");
        }

        return inscriptions;
      } catch (e) {
        console.log(e);
      }
    }

    getAccountsInscriptions();
  }, [holdings]);

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
    fontFamily: "broadacre-thin-4, sans-serif",
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          title="Tokens"
          styles={{ header: headStyle }}
          bordered={true}
          style={{}}
        >
          {totalTokens}
        </Card>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            bordered
            // dataSource={holdings}
            dataSource={tick}
            // renderItem={(holding) => (
            //   <List.Item>
            //     {holding.tick}: {holding.amt}{" "}
            //     <em>Since block {holding.updated_at_block}</em>
            //     {tick}: {holding.amt}{" "}
            //     <em>Since block {holding.updated_at_block}</em>
            //   </List.Item>
            // )}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            locale={{ emptyText: "" }}
          />
        </ConfigProvider>
      </Space>
    </div>
  );
}

export default Holdings;
