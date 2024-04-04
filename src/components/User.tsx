import { useEffect, useState } from "react";
import userService from "../services/user";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Sales from "./Sales";
import { Row, Col, Card } from "antd";

function User({ address }: { address: string }) {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  let unisat = (window as any).unisat;
  const getAddress = async () => {
    if (!address && unisat) {
      let x = await unisat.getAccounts();
      return x? x[0]: null;
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

    // set the holdings
    userService.getHoldings(address).then((data) => {
      setHoldings(data);
    });

    // Set the orders
    userService.getOrders(address).then((data) => {
      setOrders(data);
    });

   
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
          <div style={style}>
            <Card
              title="Balance"
              headStyle={headStyle}
              bordered={true}
              style={{}}
            >
              {balance.total}
            </Card>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Holdings holdings={holdings} />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Orders orders={orders} />
          </div>
        </Col>

        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Sales orders={orders} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default User;
