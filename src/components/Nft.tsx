import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Col, Row, Space, message } from "antd";
import Meta from "antd/es/card/Meta";
import btcLogo from "../images/btc-logo.png";
import "../css/nft.css";
import { FrownOutlined, LoadingOutlined } from "@ant-design/icons";

const contentPrefix = "https://static-testnet.unisat.io/content";

const apiPrefix = "http://localhost:3000";

const exchangeWallet = process.env.REACT_APP_EXCHANGE_WALLET || "";
const apiKey = process.env.REACT_APP_GECKO || "";

interface NftProps {
  address: string;
}

function Nft({ address }: NftProps) {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [convertBtcToUsd, setConvertBtcToUsd] = useState(0);
  const [totalNfts, setTotalNfts] = useState(0);

  let unisat = (window as any).unisat;

  /* ----------------------------------- Retrieve Info from Database ----------------------------------- */
  async function getNFTs() {
    try {
      // Retreiving NFTs from Database
      const response = await axios.get(apiPrefix + `/nft_orders`);

      let availableNfts = response.data.filter(
        (nft: any) => nft.buyer_address == null
      );

      // App's Stock of NFTs
      setInscriptions(availableNfts);
      setTotalNfts(availableNfts.length);
    } catch (e) {
      console.log(e);
    }
  }

  // Total NFT's in App's Marketplace
  function getMarketNftTotal() {
    let nfts = inscriptions.length;
    setTotalNfts(nfts);
  }

  // BTC => USD Conversion Rate
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
  async function buyNFT(inscription: any) {
    try {
      let txid = "";

      txid = await unisat.sendBitcoin(exchangeWallet, inscription.price, {
        feeRate: 20,
      });

      // Update NFT Order - Seller Populated Order when Listing NFT, So Only Need to Add Buyer's Address & TXID
      await axios.put(`${apiPrefix}/nft_orders/${inscription.id}`, {
        buyer_address: address,
        buyer_txid: txid,
      });
      setInscriptions(inscriptions.filter((el) => el !== inscription));
    } catch (e: any) {
      if (e.code === 4001) {
        message.error("Rejected the transaction");
      } else {
        message.error("Wallet not connected");
      }
    }
  }

  const getRate = () => {
    setTimeout(() => {
      getBtcToUsdRate();
    }, 1000);
  };

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getNFTs();
    getRate();
  }, []);

  useEffect(() => {
    if (inscriptions.length > 0) {
      getMarketNftTotal();
    }
  }, [inscriptions]);

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

      {totalNfts === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No NFTs in marketplace.</p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 50,
            paddingLeft: 100,
            overflowY: "scroll",
            height: "calc(100vh - 200px)",
            paddingBottom: 100,
          }}
        >
          <Row gutter={60} style={{ overflowY: "scroll" }}>
            {/* ------------------------- NFT Cards ------------------------- */}
            {inscriptions.map((inscription) => (
              <Col span={4.8} key={inscription.inscription_id}>
                <Card
                  hoverable
                  style={{
                    width: "220px",
                    height: "356px",
                    border: "1px solid #2b2a29",
                    marginBottom: 60,
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                  className="card-no-padding"
                  cover={
                    <div
                      style={{
                        backgroundSize: "cover",
                        width: "100%",
                      }}
                    >
                      {" "}
                      <div
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
                          className="titleLeftAlign"
                        >
                          {inscription.name}
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
                          {inscription.inscription_number}
                        </span>
                      </div>
                      {/* ---------- NFT Content ---------- */}
                      <img
                        alt={`inscription: ${inscription.inscription_number}`}
                        src={`${contentPrefix}/${inscription.inscription_id}`}
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
                          <div
                            style={{
                              marginBottom: 10,
                            }}
                            className="test"
                          >
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
                              {inscription.price}
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
                              {convertBtcToUsd ? (
                                (
                                  convertBtcToUsd *
                                  (Number(inscription.price) / 100000000)
                                ).toFixed(2)
                              ) : (
                                <LoadingOutlined />
                              )}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </Space>
                  {/* ---------- Buy Button ---------- */}
                  <Button
                    style={{ width: "80%" }}
                    onClick={() => {
                      buyNFT(inscription);
                    }}
                  >
                    Buy
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
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
Carousel - https://ant.design/components/carousel
*/
