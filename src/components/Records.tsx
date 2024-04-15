import { useState, useEffect } from "react";
import { Card, List, ConfigProvider, Space } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export type Record = {
    id: number,
    address: string,
    action: string,
    token_size: number,
    token: string,
    price?: number,
    fee?: number,
    btc_amount?: number,
    datetime: string
}

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <FrownOutlined style={{ fontSize: 20 }} />
    <p>No records</p>
  </div>
);

function Records({ records }: { records: Record[] }) {
  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };
  return (
   <div>
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Card
        title="Records"
        styles={{ header: headStyle }}
        bordered={true}
        style={{}}
      >
          {records.length}
      </Card>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <List
          bordered
          dataSource={records}
          renderItem={(record) => {
            let date = new Date(record.datetime);
            let price: string = (record.price) ? `${record.price}` : "market price";
            let btc_amount = (record.btc_amount) ? `(${record.btc_amount} BTC)` : "";
            let fee = (record.fee) ? ` (Fee: ${record.fee})` : "";
            return (<p>{record.action} {record.token_size} {record.token} at {price}{btc_amount}{fee} <em>(Updated {date.toLocaleString()})</em></p>)
          }}
        >
        </List>
      </ConfigProvider>
    </Space>
   </div>
  )
}

export default Records;
