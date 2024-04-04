import { List, Card, ConfigProvider } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export type Order = {
  id: number;
  address: string;
  tick: string;
  side: number;
  amt: number;
  price: number;
  expiration: string;
  expired: number;
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <FrownOutlined style={{ fontSize: 20 }} />
    <p>No sales</p>
  </div>
);

function Sales({ orders }: { orders: Order[] }) {
  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };

  return (
    <div>
      <Card title="Sales" headStyle={headStyle} bordered={true} style={{}}>
        0
      </Card>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <List
          bordered
          dataSource={orders}
          renderItem={(order) => {
            let dateExp = new Date(order.expiration);
            const expString = order.expired
              ? "Expired"
              : `Expires on ${dateExp.toLocaleString()}`;
            return (
              <List.Item>
                {order.tick}: {order.amt} at {order.price} <em>{expString}</em>
              </List.Item>
            );
          }}
          locale={{ emptyText: "" }}
        />
      </ConfigProvider>
    </div>
  );
}

export default Sales;
