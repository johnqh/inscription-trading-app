import { useEffect, useState } from "react";
import axios from "axios";
import { FrownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Form,
  FormProps,
  InputNumber,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import btcLogo from "../images/btc-logo.png";
import Meta from "antd/es/card/Meta";
import "../css/nft_holdings.css";

const apiPrefix = "http://localhost:3000";

const apiKey = process.env.REACT_APP_API_KEY || "";

let unisat = (window as any).unisat;

const contentPrefix = "https://static-testnet.unisat.io/content";

const exchangeWallet = process.env.REACT_APP_EXCHANGE_WALLET || "";

const { Option } = Select;

{
  /* <LeftOutlined />
<RightOutlined />; */
}

interface NftHoldingsProps {
  address: string;
}

function NftHoldings({ address }: NftHoldingsProps) {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [listInscriptions, setListInscriptions] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nftClicked, setNftClicked] = useState<any>({});
  const [totalNfts, setTotalNfts] = useState(0);
  // const [address, setAddress] = useState("");

  async function getNFTs() {
    try {
      console.log("----- ADDRESS IN GET NFTS --------");
      console.log(address);

      // let res = await unisat.getAccounts();
      // let address2 = res.data;

      // console.log("----- ADDRESS 2-----");
      // console.log(address2);

      // Retreive User's Inscription from Database (UniSat API)
      const response = await axios.get(
        apiPrefix + `/holdings/nft?address=${address}`
      );

      console.log("-----RESPONSE-----");
      console.log(response.data);

      // User's Inscriptions (Not including BRC-20)
      setInscriptions(response.data);
      setTotalNfts(response.data.length);
    } catch (e) {
      console.log(e);
    }
  }

  // async function getSummary() {
  //   const elements = [];

  //   let nfts = 0;

  //   for (let inscription of inscriptions) {
  //     nfts += 1;
  //     console.log(inscription);
  //     elements.push(
  //       <div>
  //         <span>
  //           <a
  //             style={{ color: "inherit" }}
  //             href="/"
  //             onClick={async (e) => {
  //               e.preventDefault(); // To avoid href linking instead want setMenuItem to do so
  //               // setTokenClicked(true);
  //               setModalOpen(true);
  //             }}
  //           >
  //             <img
  //               src={`${contentPrefix}/${inscription.inscriptionId}`}
  //               alt={`${inscription.inscriptionId}`}
  //               style={{
  //                 height: "20px",
  //                 width: "20px",
  //                 marginBottom: -5,
  //                 marginRight: 3,
  //               }}
  //             />
  //             NAME
  //           </a>
  //         </span>
  //       </div>
  //     );

  //     console.log("----- ELEMENTS IN NFT HOLDINGS -----");
  //     console.log(elements);

  //     setListInscriptions(elements);
  //     setTotalNfts(nfts);
  //   }
  // }

  useEffect(() => {
    unisat = (window as any).unisat;
  }, []);

  useEffect(() => {
    getNFTs();
    // getSummary();
  }, [unisat, address]);

  // useEffect(() => {
  //   if (inscriptions.length > 0) {
  //     getSummary();
  //   }
  // }, [inscriptions]);

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
    fontFamily: "broadacre-thin-4, sans-serif",
  };

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  // Order Form to Sell NFT
  async function sellNFT() {}

  // Field Type's for Order Form
  type FieldType = {
    price?: number;
  };

  // When a User Clicks Buy or Sell on Order Form
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      console.log("---PRICE IN ON FINISH ----");
      console.log(values);

      // Send the Inscription to the Exchange
      let txid = await unisat.sendInscription(
        exchangeWallet,
        nftClicked.inscriptionId,
        { feeRate: 20 }
      );

      let orderForm = {
        seller_address: address,
        txid: txid,
        inscription_id: nftClicked.inscriptionId,
        inscription_number: nftClicked.inscriptionNumber,
        price: values.price,
      };

      await axios.post(`${apiPrefix}/nft_orders`, orderForm);
      setModalOpen(false);
      confirmSell();
    } catch (e) {
      console.log(e);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
    cancelSell();
  };

  // Currency Units (Price): Order Form
  const selectAfter = (
    <Select defaultValue="sats" style={{ width: 80 }}>
      <Option value="sats">sats</Option>
      <Option value="btc">BTC</Option>
    </Select>
  );

  const confirmSell = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.success("Knock on wood! Your NFT was listed on the marketplace.");
  };

  const cancelSell = (e?: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    message.error("Aw-shucks! Your NFT was not added to the marketplace.");
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "left",
          paddingLeft: 25,
          color: "#5D647B",
          paddingTop: 20,
        }}
      >
        NFTs
      </h1>
      {totalNfts === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No NFTs</p>
        </div>
      ) : (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          {/* ------------------------- Carousel to Store NFTs ------------------------- */}
          <Carousel
            afterChange={onChange}
            slidesToShow={5}
            slidesToScroll={5}
            dots={true}
            infinite={true}
            style={{
              // height: "1200px",
              // display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              margin: 0,
              height: "400px",
              color: "black",
              lineHeight: "160px",
              textAlign: "center",
              background: "#fff",
              paddingLeft: 25,
              paddingTop: 10,
            }}
          >
            {/* ------------------------- NFT Cards ------------------------- */}
            {inscriptions.map((inscription) => (
              <div key={inscription.inscriptionId} style={{ padding: "0 5px" }}>
                <Card
                  hoverable
                  onClick={() => {
                    setNftClicked(inscription);
                    setModalOpen(true);
                  }}
                  style={{
                    width: "220px",
                    height: "356px",
                    // backgroundColor: "#f5f5f5",
                    border: "1px solid #2b2a29",
                    marginBottom: 60,
                    padding: 0,
                    textAlign: "center",
                  }}
                  className="card-no-padding"
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
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
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
                          Name
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
                          // display: imageLoading ? "none" : "block",
                        }}
                        // onLoad={() => setImageLoading(false)}
                        // onError={() => setImageLoading(false)}
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
                      description={<div style={{ marginTop: "30px" }}></div>}
                    />
                  </Space>
                </Card>
              </div>
            ))}
            {/* <Button>
              <RightOutlined />
            </Button> */}
          </Carousel>
        </Space>
      )}

      {/* ------------------------------------------------------------ Modal ------------------------------------------------------------ */}
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
            Bitcoin NFT: {nftClicked.inscriptionNumber}
          </div>
        }
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
          // setTokenClicked(false);
          // setNftClicked({});
        }}
        onCancel={() => {
          setModalOpen(false);
          // setTokenClicked(false);
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
              src={`${contentPrefix}/${nftClicked.inscriptionId}`}
              alt={`${nftClicked.inscriptionNumber}`}
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
              {`Zoro`} <span style={{ fontSize: 24 }}>#</span>
              {nftClicked.inscriptionId}
            </h1>
            <h4 style={{ marginTop: "-8px", color: "#5D647B", fontSize: "14px" }}>
              Inscription No. <span style={{ fontSize: 12 }}>#</span>
              {nftClicked.inscriptionNumber}
            </h4>

            {/* ---------- Sell Button ---------- */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Form
                // form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, marginRight: 60 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                {/* ---------- Price ---------- */}
                <Form.Item<FieldType>
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please enter a price." }]}
                >
                  <InputNumber min={1} addonAfter={selectAfter} />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#5D647B", marginTop: 30 }}
                >
                  Sell
                </Button>
              </Form>
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
              Genesis Height
              <br />
              <span style={{ fontWeight: "normal" }}>{}</span>
            </h4>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NftHoldings;

/*
-------------------- References --------------------
Carousel - https://ant.design/components/carousel
Card - https://ant.design/components/card
Modal - https://ant.design/components/modal

*/
