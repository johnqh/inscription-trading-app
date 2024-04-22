import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Row, Space } from "antd";
import Meta from "antd/es/card/Meta";
import btcLogo from "../images/btc-logo.png";

const contentPrefix = "https://static-testnet.unisat.io/content";
let inscriptionName = "ZORO";
let inscriptionPrice = 3023;

let apiPrefix = "http://localhost:3000";
let address: string;

const exchangeWallet = process.env.EXCHANGE_WALLET || "";

function Nft() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [convertBtcToUsd, setConvertBtcToUsd] = useState(0);

  let unisat = (window as any).unisat;

  /* ----------------------------------- Retrieve Info from Database ----------------------------------- */
  async function getNFTs() {
    try {
      // User's Address
      let addressResponse = await unisat.getAccounts();
      address = addressResponse[0];

      // Retreive User's Inscription from Database (UniSat API)
      const response = await axios.get(
        apiPrefix + `/holdings/nft?address=${address}`
      );

      console.log("-----RESPONSE-----");
      console.log(response.data);

      // User's Inscriptions (Not including BRC-20)
      setInscriptions(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  const apiKey = process.env.REACT_APP_GECKO || "";

  async function getBtcToUsdRate() {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const btcToUsdRate = response.data.bitcoin.usd;
      setConvertBtcToUsd(btcToUsdRate);
      return btcToUsdRate;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /* ----------------------------------- Order: Buy NFTs ----------------------------------- */

  // Buyer's Order Details
  async function buyNFT() {
    try {
      let txid = "";
      let price = 2;
      txid = await unisat.sendBitcoin(exchangeWallet, price, { feeRate: 30 });

      const addresses = await unisat.getAccounts();
      const address = addresses ? addresses[0] : null;

      // Update NFT Order - Seller Populated Order when Listing NFT, So Only Need to Add Buyer's Address
      // await axios.put(`${apiPrefix}/nft_orders/${inscriptionId}`, {
      //   fulfilled: 1,
      // });
    } catch (e: any) {
      console.log(e);
    }
  }

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getNFTs();
    getBtcToUsdRate();
  }, []);

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
          <span>Bitcoin</span> NFTs
        </h1>
        <p style={{ paddingTop: 0, color: "#5D647B" }}>
          Bitcoin Ordinal Inscriptions & Trading
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 50,
          paddingLeft: 100,
          overflowY: "scroll",
          height: "calc(100vh - 200px)", // Set the height to fill the remaining viewport space
          paddingBottom: 100,
        }}
      >
        <Row gutter={60} style={{ overflowY: "scroll" }}>
          {/* ------------------------- NFT Cards ------------------------- */}
          {inscriptions.map((inscription) => (
            <Col span={4.8} key={inscription.inscriptionId}>
              <Card
                hoverable
                style={{
                  width: "220px",
                  height: "356px",
                  // backgroundColor: "#f5f5f5",
                  border: "1px solid #2b2a29",
                  marginBottom: 60,
                }}
                cover={
                  <div
                    style={{
                      // border: "1px solid grey",
                      // borderRadius: "8px",
                      // boxSizing: "border-box",
                      backgroundSize: "cover",
                      width: "100%",
                      // height: "120px",
                      // backgroundColor: "#5D647B",
                    }}
                  >
                    {" "}
                    <div
                      className="titleLeftAlign"
                      style={{
                        paddingTop: "0px",
                        marginTop: "10px",
                      }}
                    >
                      {/* ---------- Inscription Name ---------- */}
                      <span
                        style={{
                          textAlign: "left",
                          fontWeight: "600",
                          color: "#2b2a29",
                        }}
                      >
                        {inscriptionName}
                      </span>

                      {/* ---------- Inscription Number ---------- */}
                      <span
                        style={{
                          color: "#5D647B",
                          fontWeight: "bold",
                          fontSize: "11px",
                          marginLeft: "2px",
                        }}
                      >
                        #
                      </span>
                      <span style={{ textAlign: "left", color: "#2b2a29" }}>
                        {inscription.inscriptionNumber}
                      </span>
                    </div>
                    {/* ---------- NFT Content ---------- */}
                    <img
                      alt={`inscription: ${inscription.inscriptionNumber}`}
                      src={`${contentPrefix}/${inscription.inscriptionId}`}
                      style={{
                        height: "202.8px",
                        width: "202.8px",

                        border: "1px solid grey",
                        borderRadius: "8px",
                        boxSizing: "border-box",
                      }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                }
              >
                {/* ------------------------- NFT Info ------------------------- */}
                <Space>
                  <Meta
                    title={""}
                    description={
                      <div style={{ marginTop: "30px" }}>
                        {/* ---------- BTC Image ---------- */}
                        <img
                          id="logo"
                          src={btcLogo}
                          style={{
                            height: "20px",
                            width: "20px",
                          }}
                          alt="btc-logo"
                        ></img>

                        {/* ---------- Price ---------- */}
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

                        {/* ---------- Currency Unit: Sats ---------- */}
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

                        {/* ---------- Bitcoin to USD Conversion Rate ---------- */}
                        <span>
                          $
                          {convertBtcToUsd
                            ? (
                                convertBtcToUsd *
                                (Number(inscriptionPrice) / 100000000)
                              ).toFixed(2)
                            : "Loading..."}
                        </span>
                      </div>
                    }
                  />
                </Space>
                {/* ---------- Buy Button ---------- */}
                <Button style={{ width: "100%" }} onClick={buyNFT}>
                  Buy
                </Button>
              </Card>
            </Col>
          ))}
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
UniSat API Endpoints - https://open-api-testnet.unisat.io/swagger.html
Inscription Example - https://testnet.unisat.io/inscription/0451d8f8f3181834262df077420d1c8701791c81345f17a8410e07e7c649e92ei0
Marketplace Example - https://www.gate.io/web3/inscription-market/bitcoin/brc-nft
Coin Gecko API - https://docs.coingecko.com/v3.0.1/reference/introduction
*/
