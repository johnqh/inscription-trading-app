import { useState, useEffect } from "react";
import { Card, List, ConfigProvider } from "antd";
import {SmileOutlined} from "@ant-design/icons";

export type Holding = {
  tick: string;
  address: string;
  amt: number;
  updated_at_block: number;
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>No holdings</p>
  </div>
);

function Holdings({ holdings }: { holdings: Holding[] }) {
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    setTotalTokens(holdings.reduce((total, holding) => total + holding.amt, 0));
  }, [holdings]);

  return (
    <div>
      <Card title="My Tokens" bordered={true} style={{}}></Card>
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
