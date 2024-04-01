import { List, Card, ConfigProvider } from "antd";
import {SmileOutlined} from "@ant-design/icons";

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
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>No orders</p>
  </div>
);

function Orders({ orders }: { orders: Order[] }) {
//   if (orders.length === 0) {
//     return <p>No orders.</p>;
//   }

  return (
    <div>
      <Card title="My Orders" bordered={true} style={{}}></Card>
      <ConfigProvider
        renderEmpty={customizeRenderEmpty}
      >
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

export default Orders;
