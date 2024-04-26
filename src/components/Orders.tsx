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

interface OrdersProps {
  orders: Order[];
  title: string;
}

function Orders({ orders, title }: OrdersProps) {
  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };

  const totalBySide = (title: string) => {
    if (title === "Spent") {
      return orders
        .filter((order) => order.side === 1)
        .reduce((acc, order) => acc + order.price, 0);
    } else if (title === "Profits") {
      return orders
        .filter((order) => order.side === 0)
        .reduce((acc, order) => acc + order.price, 0);
    } else {
      return orders.length;
    }
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
          {totalBySide(title)}
        </Card>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          {title === "Buy" || title === "Sell" ? (
            <List
              bordered
              style={{ maxHeight: "300px", overflowY: "scroll" }}
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
          ) : (
            <div></div>
          )}
        </ConfigProvider>
      </Space>
    </div>
  );
}

export default Orders;
