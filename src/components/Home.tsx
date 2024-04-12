import React from "react";
import { Row, Col, Button, Space } from "antd";
import {
  BookOutlined,
  SlidersOutlined,
  WalletOutlined,
} from "@ant-design/icons";

function Home() {
  return (
    <>
      <Row style={{ paddingTop: 50 }}>
        <Col
          span={12}
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 100,

            justifyContent: "center",
          }}
        >
          <div
            style={{
              textAlign: "left",
              fontSize: "50px",
              lineHeight: "1.2",
              fontWeight: "600",
            }}
          >
            Start trading
            <br />
            inscription tokens.
            <br />
            <span style={{ color: "#5D647B", textDecoration: "underline" }}>
              Instantly.
            </span>
          </div>
          <br />
          <div
            style={{ color: "#5D647B", textAlign: "left", marginRight: 180 }}
          >
            This exchange platform is geared towards a targeted Bitcoin
            community that wants a more fun and engaging way to interact with
            digital assets.
          </div>
          <br />
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button href="#market">Trade Now</Button>

            <div
              style={{
                color: "#5D647B",
                marginLeft: 10,
                marginRight: 200,
                fontSize: "8px",
                textAlign: "left",
                lineHeight: 1.6,
              }}
            >
              You can trade over 5,000 different tokens within this platform!
            </div>
          </div>
        </Col>
        <Col span={12}>col-12</Col>
      </Row>
      <Row style={{ paddingTop: 140, color: "#5D647B", textAlign: "left" }}>
        <Col span={8} style={{ paddingLeft: 100 }}>
          <Space style={{ fontWeight: "bold" }}>
            <SlidersOutlined />
            Spot Trading
          </Space>
          <br />
          <div style={{ marginRight: 80, fontSize: "10px" }}>
            Buy and sell inscription tokens immediately at the market price.
          </div>
        </Col>
        <Col span={8}>
          <Space style={{ fontWeight: "bold" }}>
            <BookOutlined />
            Order Book
          </Space>
          <br />
          <div style={{ marginRight: 80, fontSize: "10px" }}>
            Constantly updated ledger that displays all the buy and sell orders
            and ease of transition between buying and selling.
          </div>
        </Col>
        <Col span={8}>
          <Space style={{ fontWeight: "bold" }}>
            <WalletOutlined />
            Crypto Portfolio
          </Space>
          <br />
          <div style={{ marginRight: 80, fontSize: "10px" }}>
            Keep track of all the inscription tokens in your collection and
            monitor your profits.
          </div>
        </Col>
      </Row>
    </>
  );
}

export default Home;

/*
-------------------- References --------------------
Grid - https://ant.design/components/grid
Space - https://ant.design/components/space
Icons - https://ant.design/components/icon
*/
