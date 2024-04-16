import { useState, useEffect } from "react";
import { Card, List, ConfigProvider, Space } from "antd";
import { FrownOutlined } from "@ant-design/icons";

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

interface HoldingsProps {
  holdings: Holding[];
  setMenuItem: (item: string) => void; // Allows setting up where a button or a hyperlink can link.
  setSelectedToken: (token: string) => void; // Want to link to the market of the selected token the user selects
}

function Holdings({ holdings, setMenuItem, setSelectedToken }: HoldingsProps) {
  const [totalTokens, setTotalTokens] = useState(0);
  const [tick, setTick] = useState<any[]>([]);

  async function getSummary() {
    const elements = [];
    let tokens = 0;

    for (let token of holdings) {
      console.log(token);

      // If 0, Don't Include Token in User's Token List
      if (token.amt === 0) {
        continue;
      }

      elements.push(
        <div>
          <span>
            <a
              style={{ color: "inherit" }}
              href="#"
              onClick={(e) => {
                e.preventDefault(); // To avoid href linking instead want setMenuItem to do so
                setMenuItem("market");
                setSelectedToken(token.tick);
              }}
            >
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
    getSummary();
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
            dataSource={tick}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            locale={{ emptyText: "" }}
          />
        </ConfigProvider>
      </Space>
    </div>
  );
}

export default Holdings;

/*
-------------------- References -------------------- 
List - https://ant.design/components/list
Card - https://ant.design/components/card
Space - https://ant.design/components/space
CustomizeRenderEmpty() - https://ant.design/components/empty
Props Interface - https://www.geeksforgeeks.org/react-js-blueprint-suggest-props-interface/#
*/
