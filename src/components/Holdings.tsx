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

  const apiKey = process.env.REACT_APP_API_KEY || '';
  const apiUrl =
    "https://open-api-testnet.unisat.io/v1/indexer/address/tb1qeuzkvusgyxekclxwzjl49n9g30ankw60ly2l5m/brc20/summary?start=0&limit=16";

let unisat = (window as any).unisat;

function Holdings({ holdings }: { holdings: Holding[] }) {
  const [inscriptions, setInscriptions] = useState({
    list: Array(0),
    total: 0,
  });
  const [tick, setTick] = useState<any[]>([]);

  async function getSummary() {
    let responseData: any; // Define a variable to store the response data

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      responseData = response.data;
    } catch (error: any) {
      console.error("Error:", error.message);
      return null;
    }

    console.log("-----RESPONSE DATA-----");
    console.log(responseData);
    // setTick(responseData.data);
    console.log("RESPONSE TICK: " + responseData.data.detail[0].ticker);
    console.log("TICK: " + tick);
    const tokens = responseData.data.detail;

    const elements = [];

    for (let token of tokens) {
      elements.push(
        <div>
          <span>
            <a style={{ color: "inherit" }} href="/">
              {token}
            </a>
          </span>
        </div>
      );
    }

    console.log(elements);
    setTick(elements);
  }

  useEffect(() => {
    getSummary();

    // Get User's List of Inscriptions
    async function getAccountsInscriptions() {
      try {
        setInscriptions(await unisat.getInscriptions());

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
          {inscriptions.total}
        </Card>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            bordered
            dataSource={tick}
            renderItem={(item) => <List.Item>{item.ticker}</List.Item>}
            locale={{ emptyText: "" }}
          />
        </ConfigProvider>
      </Space>
    </div>
  );
}

export default Holdings;
