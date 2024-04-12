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
  message,
  Popconfirm,
  Space,
} from "antd";

let apiPrefix = "http://localhost:3000";

const apiKey = process.env.REACT_APP_API_KEY || "";
const apiUrl =
  "https://open-api-testnet.unisat.io/v1/indexer/brc20/list?start=0&limit=75";
console.log("WALLET_PRIVATE_KEY:", process.env.REACT_APP_API_KEY);

function Market() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("buy");
  const [selectedToken, setSelectedToken] = useState("");

  async function getTokens() {
    let responseData: any; // Define a variable to store the response data

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });
      responseData = response.data;
    } catch (error: any) {
      console.error("Error:", error.message);
      return null;
    }

    console.log("-----RESPONSE DATA-----");
    console.log(responseData);
    setTokens(responseData.data.detail);
    console.log("LENGTH: " + tokens.length);
  }

  let unisat = (window as any).unisat;

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getTokens();
  }, []);

  type FieldType = {
    size?: number;
    price?: number;
    expiration?: number;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      let txid = "";
      if (orderType === "buy" && values.size && values.price) {
        txid = await unisat.sendBitcoin(
          "tb1qeuzkvusgyxekclxwzjl49n9g30ankw60ly2l5m",
          values.size * values.price,
          { feeRate: 10 }
        );
      } else if (orderType === "sell" && values.size && values.price) {
        console.log(selectedToken);
        console.log(values.size);
        // Transfer Token
        const inscription = await unisat.inscribeTransfer(
          selectedToken,
          String(values.size)
        );
        txid = await unisat.sendInscription(
          "tb1qeuzkvusgyxekclxwzjl49n9g30ankw60ly2l5m",
          inscription.inscriptionId,
          { feeRate: 10 }
        );
      }

      const addresses = await unisat.getAccounts();
      const address = addresses ? addresses[0] : null;

      let orderInfo = {
        address: address,
        tick: selectedToken,
        side: orderType === "buy" ? 1 : 0,
        amt: values.size,
        price: values.price,
        expiration: values.expiration || null,
        expired: 0,
        txid: txid,
        fulfilled: 0,
      };

      console.log(orderInfo);

      console.log("Success:", values);

      await axios.post(apiPrefix + "/orders", orderInfo);
    } catch (e: any) {
      console.log(e);
      alert("Wallet not connected");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const confirmBid = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Knock on wood! Your bid was added to the order book.");
  };

  const cancelBid = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Aw-shucks! Your bid was not added to the order book.");
  };

  const confirmAsk = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Knock on wood! Your ask was added to the order book.");
  };

  const cancelAsk = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Aw-shucks! Your ask was not added to the order book.");
  };

  const confirmBuy = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Kudos! Tokens were added to your wallet.");
  };

  const cancelBuy = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Aw-shucks! Tokens weren't added to your wallet.");
  };

  const confirmSell = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Kudos! Coins were added to your wallet.");
  };

  const cancelSell = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Aw-shucks! Coins weren't added to your wallet.");
  };

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Row style={{ maxHeight: "600px", overflowY: "scroll" }}>
          {/* ------------------------- List of Tokens ------------------------- */}
          <Col span={8}>
            <List
              header={<div>Top BRC-20 Tokens</div>}
              bordered
              dataSource={tokens}
              renderItem={(token) => (
                <List.Item
                  onClick={() => {
                    setSelectedToken(token);
                    console.log(token);
                  }}
                  style={{
                    color: selectedToken === token ? "white" : "inherit",
                    backgroundColor:
                      selectedToken === token ? "#2b2a29" : "white",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  <div>
                    <span>{token}</span>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: "" }}
            />
          </Col>
          {/* ------------------------- Order Book ------------------------- */}
          <Col span={8}></Col>
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
              action={apiPrefix + "/orders"}
              method="POST"
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
                  <Popconfirm
                    title="Place bid"
                    description="Are you sure you want to place a bid?"
                    onConfirm={confirmBid}
                    onCancel={cancelBid}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ backgroundColor: "#5D647B" }}
                    >
                      Bid
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="Place ask"
                    description="Are you sure you want to place an ask?"
                    onConfirm={confirmAsk}
                    onCancel={cancelAsk}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ backgroundColor: "#5D647B" }}
                    >
                      Ask
                    </Button>
                  </Popconfirm>
                )}
                {orderType === "buy" ? (
                  <Popconfirm
                    title="Buy order"
                    description="Are you sure you want to buy at market price?"
                    onConfirm={confirmBuy}
                    onCancel={cancelBuy}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ backgroundColor: "#5D647B" }}
                      // onClick={sendBTC}
                    >
                      Buy
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="Sell order"
                    description="Are you sure you want to sell at market price?"
                    onConfirm={confirmSell}
                    onCancel={cancelSell}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ backgroundColor: "#5D647B" }}
                      // onClick={sendBRC}
                    >
                      Sell
                    </Button>
                  </Popconfirm>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </>
  );
}

export default Market;

/*
-------------------- References -------------------- 
Grid (Row, Col) - https://ant.design/components/grid
List - https://ant.design/components/list
Form - https://ant.design/components/form
Button - https://ant.design/components/button
Ponconfirm - https://ant.design/components/popconfirm
UniSat - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet#sendbitcoin
Overflow Scroll - https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
*/
