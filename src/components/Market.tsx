import React, { useState, useEffect } from "react";
import axios from "axios"; // HTTP requests
import {
  Button,
  List,
  Row,
  Col,
  Form,
  Input,
  Radio,
  type FormProps,
} from "antd";

let apiPrefix = "http://localhost:3000";

function Market() {
  const [tokenElements, setTokenElements] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("buy");

  async function getTokens() {
    let url = apiPrefix + "/deploy";
    let response = await axios.get(url);

    console.log(response.data);
    const tokens = response.data;

    const elements = [];

    for (let token of tokens) {
      elements.push(
        <div>
          <span>{token.tick}</span>
        </div>
      );
    }
    console.log(elements);
    setTokenElements(elements);
  }

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getTokens();
  }, []);

  type FieldType = {
    size?: number;
    price?: number;
    expiration?: number;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Row>
        {/* ------------------------- List of Tokens ------------------------- */}
        <Col span={8}>
          <List
            header={<div>Top BRC-20 Tokens</div>}
            bordered
            dataSource={tokenElements}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            locale={{ emptyText: "" }}
          />
        </Col>
        {/* ------------------------- Order Book ------------------------- */}
        <Col span={8}>col-8</Col>

        {/* ------------------------- Order Form: Buy or Sell ------------------------- */}
        <Col span={8}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="Order" name="order">
              <Radio.Group
                onChange={(e) => setOrderType(e.target.value)}
                value={orderType}
              >
                <Radio.Button value="buy">Buy</Radio.Button>
                <Radio.Button value="sell">Sell</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item<FieldType>
              label="Size"
              name="size"
              rules={[
                {
                  required: true,
                  message: "Please input the amount of tokens.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[
                { required: false, message: "Please enter a limit price." },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Expiration"
              name="expiration"
              rules={[
                {
                  required: false,
                  message: "Please enter an expiration time.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              {orderType === "buy" ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#5D647B" }}
                >
                  Bid
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#5D647B" }}
                >
                  Ask
                </Button>
              )}
              {orderType === "buy" ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#5D647B" }}
                >
                  Buy
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#5D647B" }}
                >
                  Sell
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Market;

/*
-------------------- References -------------------- 
List - https://ant.design/components/list  
*/
