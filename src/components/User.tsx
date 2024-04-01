import { useEffect, useState } from "react";
import userService from "../services/user";
import Holdings from "./Holdings";
import Orders from "./Orders";
import { Row, Col, Card } from "antd";

function User({ address }: { address: string }) {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  let unisat = (window as any).unisat;
  const getAddress = async () => {
    if (!address) {
      //   let unisat = (window as any).unisat;
      let x = await unisat.getAccounts();
      return x[0];
    } else {
      return address;
    }
  };

  // Get User's Account Balance
  async function getAccountBalance() {
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

  return (
    <div>
      <Row gutter={16}>
        <Col className="gutter-row" span={6}>
          <div style={style}>
            <Card title="My Balance" bordered={true} style={{ }}>
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
          <div style={style}>col-6</div>
        </Col>
      </Row>
    </div>
  );
}

export default User;
