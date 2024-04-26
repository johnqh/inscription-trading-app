import React, { useState, useEffect } from "react";
import axios from "axios"; // HTTP requests
import {
  Button,
  List,
  Row,
  Col,
  Form,
  Radio,
  type FormProps,
  message,
  Popconfirm,
  Space,
  DatePicker,
  InputNumber,
  InputNumberProps,
  Select,
} from "antd";

// Imports for Expiration Part of the Order Form
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD HH:mm:ss";

const { Option } = Select;

const exchangeWallet = process.env.REACT_APP_EXCHANGE_WALLET || "";

let apiPrefix = "http://localhost:3000";

interface MarketProps {
  address: string;
  selectedToken: string;
  setSelectedToken: (token: string) => void;
  orderType: string;
  setOrderType: (type: string) => void;
}

function Market({ address, selectedToken, setSelectedToken, orderType, setOrderType}: MarketProps) {
  const [tokens, setTokens] = useState<any[]>([]);
  // const [orderType, setOrderType] = useState(orderFormType || "buy");
  // const [selectedToken, setSelectedToken] = useState("");
  const [buySpotPrice, setBuySpotPrice] = useState(0);
  const [sellSpotPrice, setSellSpotPrice] = useState(0);
  const [orderPrice, setOrderPrice] = useState(0);

  const [form] = Form.useForm();

  /* ----------------------------------- Retrieving Info from Database ----------------------------------- */
  async function getTokens() {
    let responseData: any; // Define a variable to store the response data

    try {
      // Getting List of BRC-20 Tokens from Database (UniSat API)
      const response = await axios.get(apiPrefix + "/deploy");
      responseData = response.data;
    } catch (error: any) {
      console.error("Error:", error.message);
      return null;
    }

    console.log("-----RESPONSE DATA-----");
    console.log(responseData);
    setTokens(responseData);
    console.log("LENGTH: " + tokens.length);
  }

  // Get The Spot Price for both Buyer & Seller
  async function getSpotPrice() {
    try {
      // Retrieing Orders from Order Book (Database)
      const response = await axios.get(apiPrefix + "/orders");
      const orders = response.data;

      // Spot Price
      let sellerSpotPrice = Number.MIN_SAFE_INTEGER;
      let buyerSpotPrice = Number.MAX_SAFE_INTEGER;

      console.log(selectedToken);
      // Loop through Order Book
      for (let order of orders) {
        if (!order.fulfilled && order.tick === selectedToken) {
          // Spot Price for Buyer is Lowest Price Seller is Willing to Sell
          if (order.side === 0) {
            console.log(order);

            if (order.price < buyerSpotPrice) {
              buyerSpotPrice = order.price;
            }
            console.log(buyerSpotPrice);
          }

          // Spot Price for Seller is Greatest Price Buyer is Willing to Buy
          if (order.side === 1) {
            if (order.price > sellerSpotPrice) {
              sellerSpotPrice = order.price;
            }
          }
        }
      }

      console.log("NUmber MIN: " + Number.MIN_SAFE_INTEGER);

      if (buyerSpotPrice === Number.MAX_SAFE_INTEGER) {
        buyerSpotPrice = 0;
      }

      if (sellerSpotPrice === Number.MIN_SAFE_INTEGER) {
        sellerSpotPrice = 0;
      }

      setSellSpotPrice(sellerSpotPrice);
      setBuySpotPrice(buyerSpotPrice);

      console.log("------SELL SPOT PRICE------");
      console.log(sellSpotPrice);
      console.log("------BUY SPOT PRICE------");
      console.log(buySpotPrice);
    } catch (error: any) {
      console.error("Error:", error.message);
      return null;
    }
  }

  let unisat = (window as any).unisat;

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getTokens();
  }, []);

  // When a Token is Selected Retrieve it's Spot Price
  useEffect(() => {
    getSpotPrice();
  }, [selectedToken]);

  /* ----------------------------------- Order Form ----------------------------------- */

  // Field Type's for Order Form
  type FieldType = {
    size?: number;
    price?: number;
    expiration?: number;
  };

  // When a User Clicks Buy or Sell on Order Form
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      let txid = "";

      // Make Sure the User Selects a Specific Token to Buy or Sell
      if (selectedToken === "") {
        alert("Oops! You didn't select a token.");
        return;
      }

      console.log("-----VALUES-------");
      console.log(values);

      console.log("EXCHANGE WALLET");
      console.log(exchangeWallet);

      if (orderType === "buy" && values.size) {
        // Info Field for Price is Blank
        if (!orderPrice) {
          setOrderPrice(buySpotPrice);
        }

        // Buyer sends Payment (BTC) to Exchange for BRC-20 Tokens
        txid = await unisat.sendBitcoin(
          exchangeWallet,
          values.size * orderPrice,
          { feeRate: 30 }
        );
        confirmBuy();
      } else if (orderType === "sell" && values.size) {
        // Info Field for Price is Blank
        if (!orderPrice) {
          setOrderPrice(sellSpotPrice);
        }
        // Testing Purposes
        console.log(selectedToken);
        console.log(values.size);

        // Seller Inscribes Transfer (Pays UniSat for this Service): Need to Inscribe First before Transferring Tokens, Otherwise it Sends the Inscription not Token
        const inscription = await unisat.inscribeTransfer(
          selectedToken,
          String(values.size)
        );

        // Seller Sends BRC-20 Tokens to the Exchange
        txid = await unisat.sendInscription(
          exchangeWallet,
          inscription.inscriptionId,
          { feeRate: 10 }
        );
        confirmSell();
      }

      // User's Address
      const addresses = await unisat.getAccounts();
      const address = addresses ? addresses[0] : null;

      // Order Information for Order Book (Database)
      let orderInfo = {
        address: address,
        tick: selectedToken,
        side: orderType === "buy" ? 1 : 0,
        amt: values.size,
        price: orderPrice,
        expiration: values.expiration || null,
        expired: 0,
        txid: txid,
        fulfilled: 0,
      };

      // Testing Purposes
      console.log(orderInfo);
      console.log("Success:", values);

      // Create Order in the Database
      await axios.post(apiPrefix + "/orders", orderInfo);
    } catch (e: any) {
      console.log(e);
      if (e.code === 4001) {
        alert("Rejected the transaction");
      } else {
        alert("Wallet not connected");
      }
    }
  };

  // Size: Order Form
  const onChange: InputNumberProps["onChange"] = (value) => {
    console.log("changed", value);
  };

  // Currency Units (Price): Order Form
  const selectAfter = (
    <Select defaultValue="sats" style={{ width: 80 }}>
      <Option value="sats">sats</Option>
      <Option value="btc">BTC</Option>
    </Select>
  );

  /* ----------------------------------- Order Form: Mouse Events ----------------------------------- */
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

  const onImageError = (e: any) => {
    e.target.style.display = "none";
  };

  return (
    <>
      {/* ------------------------- Title Header ------------------------- */}
      <div
        style={{
          textAlign: "left",
          paddingLeft: 100,
          paddingTop: 30,
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            lineHeight: "1.2",
            fontWeight: "600",
            color: "#5D647B",
          }}
        >
          BRC-20 Tokens
        </h1>
        <p style={{ paddingTop: 0, color: "#5D647B" }}>
          Bitcoin Ordinal Inscriptions & Trading
        </p>
      </div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Row
          style={{
            marginTop: 50,
            paddingLeft: 100,
          }}
        >
          {/* ------------------------- List of Tokens ------------------------- */}
          <Col
            span={8}
            style={{
              // height: "calc(100vh - 200px)", // Set the height to fill the remaining viewport space

              paddingBottom: 200,
            }}
          >
            <List
              header={<div>Top BRC-20 Tokens</div>}
              style={{ maxHeight: "480px", overflowY: "scroll" }}
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
                    {typeof token === "boolean" ? (
                      ""
                    ) : (
                      <img
                        src={`https://next-cdn.unisat.io/_/img/tick/${token}.png`}
                        alt=""
                        onError={onImageError}
                        style={{
                          height: "20px",
                          width: "20px",
                          marginBottom: -5,
                          marginRight: 3,
                        }}
                      />
                    )}

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
          <Col span={8} style={{}}>
            <div style={{}}>
              <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, marginRight: 60 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                {/* ---------- Buy/Sell Radio Buttons ---------- */}
                <Form.Item label="Order" name="order">
                  <Radio.Group
                    onChange={(e) => setOrderType(e.target.value)}
                    value={orderType}
                  >
                    <Radio.Button value="buy">Buy</Radio.Button>
                    <Radio.Button value="sell">Sell</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {/* ---------- Size ---------- */}
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
                  <InputNumber min={1} onChange={onChange} />
                </Form.Item>

                {/* ---------- Price ---------- */}
                <Form.Item<FieldType>
                  label="Price"
                  name="price"
                  rules={[
                    { required: false, message: "Please enter a limit price." },
                  ]}
                >
                  <InputNumber
                    min={1}
                    addonAfter={selectAfter}
                    onChange={(price) => {
                      setOrderPrice(
                        price ||
                          (orderType === "buy" ? buySpotPrice : sellSpotPrice)
                      );
                    }}
                  />
                </Form.Item>

                {/* ---------- Expiration ---------- */}
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
                  <DatePicker
                    minDate={dayjs("2024-04-01", dateFormat)}
                    maxDate={dayjs("2025-10-31", dateFormat)}
                    format={dateFormat}
                  />
                </Form.Item>

                {/* ---------- Bid or Ask Buttons ---------- */}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  {orderType === "buy" ? (
                    <Popconfirm
                      title="Place bid"
                      description="Are you sure you want to place a bid?"
                      // onConfirm={confirmBid}
                      // onCancel={cancelBid}
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
                      // onConfirm={confirmAsk}
                      // onCancel={cancelAsk}
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

                  {/* ---------- Buy or Sell Buttons ---------- */}
                  {orderType === "buy" ? (
                    <Popconfirm
                      title="Buy order"
                      description={
                        <span>
                          Are you sure you want to{" "}
                          <strong>
                            <span style={{ color: "#296e01" }}>buy</span>{" "}
                            {selectedToken}
                          </strong>{" "}
                          at the{" "}
                          <u>
                            {orderPrice === buySpotPrice
                              ? "market price"
                              : "price"}
                          </u>{" "}
                          of <strong>{orderPrice} sats</strong>?
                        </span>
                      }
                      onConfirm={() => {
                        form.submit();
                      }}
                      onCancel={cancelBuy}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        // htmlType="submit"
                        style={{ backgroundColor: "#5D647B" }}
                      >
                        Buy
                      </Button>
                    </Popconfirm>
                  ) : (
                    <Popconfirm
                      title="Sell order"
                      description={
                        <span>
                          Are you sure you want to{" "}
                          <strong>
                            <span style={{ color: "#d92121" }}>sell</span>{" "}
                            {selectedToken}
                          </strong>{" "}
                          at the{" "}
                          <u>
                            {orderPrice === sellSpotPrice
                              ? "market price"
                              : "price"}
                          </u>{" "}
                          of <strong>{orderPrice} sats</strong>?
                        </span>
                      }
                      onConfirm={() => {
                        form.submit();
                      }}
                      onCancel={cancelSell}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#5D647B" }}
                      >
                        Sell
                      </Button>
                    </Popconfirm>
                  )}
                </Form.Item>
              </Form>
            </div>
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
InputNumber - https://ant.design/components/input-number
Button - https://ant.design/components/button
Ponconfirm - https://ant.design/components/popconfirm
DatePicker - https://ant.design/components/date-picker
UniSat - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet#sendbitcoin
Overflow Scroll - https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
Spot Price - https://www.investopedia.com/terms/s/spotprice.asp#:~:text=The%20spot%20price%20is%20the,or%20sold%20for%20immediate%20delivery.
Number.MIN_SAFE_INTEGER - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER
Number.MAX_SAFE_INTEGER - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
Day.js - https://day.js.org/docs/en/plugin/custom-parse-format
form - https://stackoverflow.com/questions/74387690/how-to-submit-the-antd-form-onconfirmation-of-antd-popconfirm
Broken Images - https://www.codevertiser.com/check-and-resolve-broken-images-in-reactjs/
*/
