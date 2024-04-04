import { useState, useEffect } from "react";
import { Card, List, ConfigProvider } from "antd";
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

function Holdings({ holdings }: { holdings: Holding[] }) {
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    setTotalTokens(holdings.reduce((total, holding) => total + holding.amt, 0));
  }, [holdings]);

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
    fontFamily: "broadacre-thin-4, sans-serif",
  };

  return (
    <div>
      <Card title="Tokens" headStyle={headStyle} bordered={true} style={{}}>
        0
      </Card>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <List
          bordered
          dataSource={holdings}
          renderItem={(holding) => (
            <List.Item>
              {holding.tick}: {holding.amt}{" "}
              <em>Since block {holding.updated_at_block}</em>
            </List.Item>
          )}
          locale={{ emptyText: "" }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Holdings;
