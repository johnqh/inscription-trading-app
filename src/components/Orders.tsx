import { List, Card, ConfigProvider, Space } from "antd";
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
    <p>No orders</p>
  </div>
);

function Orders({ orders, title }: { orders: Order[], title: string }) {
  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };

  console.log(orders);

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          title={title}
          styles={{ header: headStyle }}
          bordered={true}
          style={{}}
        >
          {orders.length}
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
                  {order.tick}: {order.amt} at {order.price}{" "}
                  <em>{expString}</em>
                </List.Item>
              );
            }}
            locale={{ emptyText: "" }}
          />
        </ConfigProvider>
      </Space>
    </div>
  );
}

export default Orders;
