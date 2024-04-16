import React from "react";
import { Button, Card, Col, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import btcLogo from "../images/btc-logo.png";

const contentPrefix = "https://static-testnet.unisat.io/content";
const inscriptionID =
  "0451d8f8f3181834262df077420d1c8701791c81345f17a8410e07e7c649e92ei0";
const inscriptionNumber = "#3524564";
const inscriptionName = "ZORO";
const inscriptionPrice = "3023";
const genesisHeight = "2586257";
const outputValue = "3000";

function Nft() {
  let unisat = (window as any).unisat;

  async function buyNFT() {
    try {
      let txid = "";
      let price = 2;
      txid = await unisat.sendBitcoin(
        "tb1qeuzkvusgyxekclxwzjl49n9g30ankw60ly2l5m",
        price,
        { feeRate: 10 }
      );

      const addresses = await unisat.getAccounts();
      const address = addresses ? addresses[0] : null;

      let orderInfo = {
        seller_address: address,
        buyer_address: address || null,
        inscriptionNumber: inscriptionNumber,
        inscriptionID: inscriptionID,
        genesisHeight: genesisHeight,
        outputValue: outputValue,
        // side: orderType === "buy" ? 1 : 0,
        price: inscriptionPrice,
        expiration: null,
        expired: 0,
        txid: txid,
        fulfilled: 0,
      };

      console.log(orderInfo);
    } catch (e: any) {
      console.log(e);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 50,
        }}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <div
                  style={{
                    border: "1px solid grey",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    alt={`inscription: ${inscriptionNumber}`}
                    src={`${contentPrefix}/${inscriptionID}`}
                    style={{}}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              }
            >
              <Space>
                <Meta
                  title={
                    <div className="titleLeftAlign">
                      {inscriptionName} {inscriptionNumber}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: "30px" }}>
                      <img
                        id="logo"
                        src={btcLogo}
                        style={{
                          height: "20px",
                          width: "20px",
                        }}
                        alt="btc-logo"
                      ></img>
                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginLeft: "2px",
                          marginTop: "13px",
                          textAlign: "left",
                        }}
                      >
                        {" "}
                        {inscriptionPrice}
                      </span>

                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "bold",
                          fontSize: "10px",
                          marginLeft: "2px",
                        }}
                      >
                        sats
                      </span>
                    </div>
                  }
                />
              </Space>
              <Button style={{ width: "100%" }} onClick={buyNFT}>
                Buy
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <div
                  style={{
                    border: "1px solid grey",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    alt={`inscription: ${inscriptionNumber}`}
                    src={`${contentPrefix}/${inscriptionID}`}
                    style={{}}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              }
            >
              <Space>
                <Meta
                  title={
                    <div className="titleLeftAlign">
                      {inscriptionName} {inscriptionNumber}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: "30px" }}>
                      <img
                        id="logo"
                        src={btcLogo}
                        style={{
                          height: "20px",
                          width: "20px",
                        }}
                        alt="btc-logo"
                      ></img>
                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginLeft: "2px",
                          marginTop: "13px",
                          textAlign: "left",
                        }}
                      >
                        {" "}
                        {inscriptionPrice}
                      </span>

                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "bold",
                          fontSize: "10px",
                          marginLeft: "2px",
                        }}
                      >
                        sats
                      </span>
                    </div>
                  }
                />
              </Space>
              <Button style={{ width: "100%" }} onClick={buyNFT}>
                Buy
              </Button>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={
                <div
                  style={{
                    border: "1px solid grey",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <img
                    alt={`inscription: ${inscriptionNumber}`}
                    src={`${contentPrefix}/${inscriptionID}`}
                    style={{}}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              }
            >
              <Space>
                <Meta
                  title={
                    <div className="titleLeftAlign">
                      {inscriptionName} {inscriptionNumber}
                    </div>
                  }
                  description={
                    <div style={{ marginTop: "30px" }}>
                      <img
                        id="logo"
                        src={btcLogo}
                        style={{
                          height: "20px",
                          width: "20px",
                        }}
                        alt="btc-logo"
                      ></img>
                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "600",
                          fontSize: "14px",
                          marginLeft: "2px",
                          marginTop: "13px",
                          textAlign: "left",
                        }}
                      >
                        {" "}
                        {inscriptionPrice}
                      </span>

                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "bold",
                          fontSize: "10px",
                          marginLeft: "2px",
                        }}
                      >
                        sats
                      </span>
                    </div>
                  }
                />
              </Space>
              <Button style={{ width: "100%" }} onClick={buyNFT}>
                Buy
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Nft;

/*
-------------------- References --------------------
Grid - https://ant.design/components/grid
Card - https://ant.design/components/card
UniSat Wallet API - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet
Inscription Example - https://testnet.unisat.io/inscription/0451d8f8f3181834262df077420d1c8701791c81345f17a8410e07e7c649e92ei0
Marketplace Example - https://www.gate.io/web3/inscription-market/bitcoin/brc-nft
*/
