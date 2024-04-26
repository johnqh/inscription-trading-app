import { useEffect, useState } from "react";
import userService from "../services/user";
import Holdings from "./Holdings";
import Orders from "./Orders";
import btcLogo from "../images/btc-logo.png";
import { Row, Col, Card, Flex, Space } from "antd";
import NftHoldings from "./NftHoldings";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

import {
  Chart,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(ArcElement);
Chart.register(
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

interface UserProps {
  address: string;
  // These Props Below are Needed for Holdings
  setMenuItem: (item: string) => void; // Allows setting up where a button or a hyperlink can link.
  setSelectedToken: (token: string) => void; // Want to link to the market of the selected token the user selects.
  setOrderType: (token: string) => void;
}

function User({ address, setMenuItem, setSelectedToken, setOrderType }: UserProps) {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [currencyUnit, setCurrencyUnit] = useState(true); // Keep Track of which Currency Unit to Show Sats or BTC

  let unisat = (window as any).unisat;

  const getAddress = async () => {
    if (!address && unisat) {
      let x = await unisat.getAccounts();
      return x ? x[0] : null;
    } else {
      return address;
    }
  };

  // Get User's Account Balance
  async function getAccountBalance() {
    // To Avoid Attempting to Retrieve Balance when User Still Hasn't Connected to Wallet
    if (!address) {
      return;
    }

    try {
      setBalance(await unisat.getBalance());
      console.log("BALANCE: ", balance);
      return balance;
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    // Set the address
    getAddress().then((data) => {
      if (data != address) {
        address = data;
      }
      console.log(address);
    });

    getAccountBalance();

    // Change Between Balances (Sats or BTC) Every 12 Seconds
    const intervalId = setInterval(() => {
       setCurrencyUnit((prevCurrencyUnit) => !prevCurrencyUnit);
    }, 12000);

    // set the holdings
    userService.getHoldings(address).then((data) => {
      setHoldings(data);
    });

    // Set the orders
    userService.getOrders(address).then((data) => {
      setOrders(data);
    });

    // Clean Up Interval
    return () => clearInterval(intervalId);
  }, [address]);

  if (!address) {
    return <p>Wallet not connected</p>;
  }

  const style: React.CSSProperties = {
    background: "fff",
    padding: "8px 0",
    height: "500px",
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };

  return (
    <div style={{ maxHeight: "80vh", overflowY: "scroll", paddingBottom: 200 }}>
      {/* ------------------------------ 1st Row ------------------------------ */}
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div style={style}>
              {/* -------------------- Balance -------------------- */}
              <Card
                title="Balance"
                styles={{ header: headStyle }}
                bordered={true}
              >
                <Flex justify="center">
                  <Space size={[6, 6]} wrap style={{}}>
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
                    <div>
                      <span>
                        {currencyUnit
                          ? balance.total
                          : (balance.total / 100000000).toFixed(8)}
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
                        {currencyUnit ? "sats" : "BTC"}
                      </span>
                    </div>
                  </Space>
                </Flex>
              </Card>
            </div>
          </Space>
        </Col>

        {/* -------------------- Tokens -------------------- */}
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Holdings
              holdings={holdings}
              setMenuItem={setMenuItem}
              setSelectedToken={setSelectedToken}
              setOrderType={setOrderType}
            />
          </div>
        </Col>

        {/* -------------------- Buys -------------------- */}
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Orders
              orders={orders.filter((order) => order.side === 1)}
              title="Buy"
            />
          </div>
        </Col>

        {/* -------------------- Sells -------------------- */}
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Orders
              orders={orders.filter((order) => order.side === 0)}
              title="Sell"
            />
          </div>
        </Col>
      </Row>

      {/* ------------------------------ 2nd Row ------------------------------ */}
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "130px",
              }}
            >
              {" "}
              <h1
                style={{
                  textOrientation: "upright",
                  writingMode: "vertical-rl",
                  alignItems: "center",
                  color: "#5D647B",
                }}
              >
                CHARTS
              </h1>
            </div>
          </Space>
        </Col>

        {/* -------------------- Doughnut Chart -------------------- */}
        <Col className="gutter-row" span={6} style={{ alignItems: "baseline" }}>
          <div style={{ margin: "20px auto", maxWidth: "600px" }}>
            <DoughnutChart holdings={holdings} />
          </div>
        </Col>

        {/* -------------------- Bar Chart -------------------- */}
        <Col className="gutter-row" span={6}>
          <div style={{ margin: "20px auto" }}>
            <BarChart orders={orders.filter((order) => order.side === 1)} />
          </div>
        </Col>

        {/* -------------------- Line Chart -------------------- */}
        <Col className="gutter-row" span={6}>
          <div style={{ margin: "20px auto", maxWidth: "600px" }}>
            <LineChart orders={orders.filter((order) => order.side === 0)} />
          </div>
        </Col>
      </Row>

      {/* ------------------------------ 3rd Row ------------------------------ */}
      {/* -------------------- NFTs -------------------- */}
      <div>
        <NftHoldings address={address}></NftHoldings>
      </div>
    </div>
  );
}

export default User;

/*
-------------------- References --------------------
Grid - https://ant.design/components/grid
Space - https://ant.design/components/space
Flex - https://ant.design/components/flex
Card - https://ant.design/components/card
arc - https://stackoverflow.com/questions/70098392/react-chartjs-2-with-chartjs-3-error-arc-is-not-a-registered-element
bar graph - https://wanuja18.medium.com/here-are-some-errors-which-i-faced-while-implementing-bar-chart-and-doughnut-chart-8d2cb639b632
*/
