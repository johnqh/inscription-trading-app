import { useEffect, useState } from "react";
import userService from "../services/user";
import Holdings from "./Holdings";
import Orders from "./Orders";
import btcLogo from "../images/btc-logo.png";
import { Row, Col, Card, Flex, Space } from "antd";

function User({ address }: { address: string }) {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [isTotal, setIsTotal] = useState(true); // Keep Trackk which Balance to Show Sats or BTC

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

    // Change Between Balances (Sats or BTC) Every 5 Seconds
    const intervalId = setInterval(() => {
      setIsTotal((prevIsTotal) => !prevIsTotal);
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
  };

  const headStyle = {
    backgroundColor: "#5D647B",
    color: "#f5f5f5",
  };

  return (
    <div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <div style={style}>
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
                        {isTotal
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
                        {isTotal ? "sats" : "BTC"}
                      </span>
                    </div>
                  </Space>
                </Flex>
              </Card>
            </div>
          </Space>
        </Col>

        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Holdings holdings={holdings} />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Orders
              orders={orders.filter((order) => order.side === 1)}
              title="Buy"
            />
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Orders
              orders={orders.filter((order) => order.side === 0)}
              title="Sell"
            />
          </div>
        </Col>
      </Row>
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
*/