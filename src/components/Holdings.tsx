import { useState, useEffect } from "react";
import { Card, List, ConfigProvider, Space, Modal, Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import axios from "axios"; // HTTP requests
import btcLogo from "../images/btc-logo.png";

export type Holding = {
  tick: string;
  address: string;
  amt: number;
  updated_at_block: number;
};

const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <FrownOutlined style={{ fontSize: 20 }} />
    <p>No holdings</p>
  </div>
);

let unisat = (window as any).unisat;

function Holdings({ holdings }: { holdings: Holding[] }) {
  const [totalTokens, setTotalTokens] = useState(0);
  const [tick, setTick] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [tokenClicked, setTokenClicked] = useState(false);
  const [inscriptionData, setInscriptionData] = useState<any>({});

  const apiKey = process.env.REACT_APP_API_KEY || "";

  async function inscriptionInfo(ticker: string) {
    try {
      const response = await axios.get(
        `https://open-api-testnet.unisat.io/v1/indexer/brc20/${ticker}/info`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      setInscriptionData(response.data.data);
    } catch (error: any) {
      console.error("Error:", error.message);
      setInscriptionData({ error: true });
    } 
  }

  async function getSummary() {
    const elements = [];
    let tokens = 0;

    for (let token of holdings) {
      console.log(token);
      elements.push(
        <div>
          <span>
            <a
              style={{ color: "inherit" }}
              href="/"
              onClick={async (e) => {
                e.preventDefault(); // To avoid href linking instead want setMenuItem to do so
                setTokenClicked(true);
                await inscriptionInfo(token.tick); // Call details function with token.tick
                setModalOpen(true);
              }}
            >
              <img
                src={`https://next-cdn.unisat.io/_/img/tick/${token.tick}.png`}
                alt={`${token.tick}`}
                style={{
                  height: "20px",
                  width: "20px",
                  marginBottom: -5,
                  marginRight: 3,
                }}
              />
              {token.tick}: {token.amt}
            </a>
          </span>
        </div>
      );
      tokens += token.amt;
    }

    setTick(elements);
    setTotalTokens(tokens);
  }

  useEffect(() => {
    getSummary();
  }, [holdings]);

  useEffect(() => {
    getSummary();
  }, [tokenClicked]);

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
    fontFamily: "broadacre-thin-4, sans-serif",
  };

  // Formatting Number (Rounding) to be Readable in Modal
  function formatNumber(number: number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    } else {
      return number.toString();
    }
  }

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Card
          title="Tokens"
          styles={{ header: headStyle }}
          bordered={true}
          style={{}}
        >
          {totalTokens}
        </Card>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            bordered
            dataSource={tick}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            locale={{ emptyText: "" }}
          />
        </ConfigProvider>
      </Space>
      {/* ------------------------------ Modal ------------------------------ */}
      <Modal
        title={
          <div
            style={{
              color: "#5D647B",
              textTransform: "uppercase",
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            BRC-20 Token: {inscriptionData.ticker}
          </div>
        }
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
          setTokenClicked(false);
        }}
        onCancel={() => {
          setModalOpen(false);
          setTokenClicked(false);
        }}
        style={{ backgroundColor: "#5D647B" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{}}>
            <img
              src={`https://next-cdn.unisat.io/_/img/tick/${inscriptionData.ticker}.png`}
              alt={`${inscriptionData.ticker}`}
              style={{
                height: "80px",
                width: "80px",
                marginBottom: -5,
                marginRight: 3,
                paddingLeft: 50,
              }}
            />
          </div>

          {/* ---------- Token Details ---------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingRight: 150,
              paddingTop: "",
              marginTop: "20px",
            }}
          >
            <h1>
              {inscriptionData.ticker} <span style={{ fontSize: 24 }}>#</span>
              {inscriptionData.holdersCount}
            </h1>
            <h4 style={{ marginTop: "-8px", color: "#5D647B" }}>
              Inscription No. <span style={{ fontSize: 12 }}>#</span>
              {inscriptionData.inscriptionNumber}
            </h4>

            {/* ---------- Spot Prices for Buying / Selling ---------- */}
            <p>Spot Price</p>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginTop: "-20px",
              }}
            >
              <img
                id="logo"
                src={btcLogo}
                style={{
                  height: "20px",
                  width: "20px",
                  marginTop: "5px",
                }}
                alt="btc-logo"
              ></img>

              <span
                style={{
                  marginLeft: "3px",
                }}
              >
                30
              </span>
              <span
                style={{
                  color: "#5D647B",
                  fontWeight: "bold",
                  fontSize: "10px",
                  marginLeft: "2px",
                  marginTop: "13px",
                }}
              >
                sats
              </span>
            </div>

            {/* ---------- Buy / Sell Buttons ---------- */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20}}>
              <Button style={{ marginTop: 30 }}>Buy</Button>
              <Button style={{ marginTop: 30 }}>Sell</Button>
            </div>
          </div>
        </div>

        {/* ---------- Token Details ---------- */}
        <div
          style={{
            paddingLeft: 150,
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              backgroundColor: "#f5f5f7",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              flexWrap: "wrap",
              flexGrow: "2",
            }}
          >
            <h4>
              Max <br />
              <span style={{ fontWeight: "normal" }}>
                {formatNumber(Number(inscriptionData.max))}
              </span>
            </h4>
            <h4>
              Limit
              <br />
              <span style={{ fontWeight: "normal" }}>
                {formatNumber(Number(inscriptionData.limit))}
              </span>
            </h4>
            <h4>
              Minted
              <br />
              <span style={{ fontWeight: "normal" }}>
                {formatNumber(Math.ceil(Number(inscriptionData.minted)))}
              </span>
            </h4>
            <h4>
              Genesis Height
              <br />
              <span style={{ fontWeight: "normal" }}>
                {inscriptionData.deployHeight}
              </span>
            </h4>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Holdings;

/*
-------------------- References --------------------
Modal - https://ant.design/components/modal
UniSat Endpoints - https://open-api-testnet.unisat.io/swagger.html
Flexbox - https://css-tricks.com/snippets/css/a-guide-to-flexbox/
*/
