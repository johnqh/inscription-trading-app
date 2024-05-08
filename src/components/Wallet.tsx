import React, { useState, useEffect } from "react";
import { CopyOutlined } from "@ant-design/icons";
import { Button, message } from "antd";

let unisat = (window as any).unisat;

function Wallet(props: { accounts: string[] }) {
  const [accountsAddress, setAccountsAddress] = useState<string[]>([]);
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  });
  const [inscriptions, setInscriptions] = useState({
    list: Array(0),
    total: 0,
  });
  const [address, setAddress] = useState<string[]>([]);
  const [showWallet, setShowWallet] = useState("hide");

  // In Case Unisat Doesn't get Loaded
  if (!unisat) {
    unisat = (window as any).unisat;
  }

  useEffect(() => {
    connectWallet();
  }, [props.accounts]);

  // Connecting to User's UniSat Wallet
  async function connectWallet() {
    if (props.accounts.length === 0) return;

    let alertMsg =
      "You don't have the UniSat Wallet Extension installed.\nYou need to download this extension on the Google Chrome web store to interact with this website.";

    // Verifies if the User is Running a Browser with the UniSat Wallet Extension
    if (typeof unisat === "undefined") return alert(alertMsg);

    try {
      console.log("UniSat Wallet is installed!");

      // Get User's Account Info
      setAccountsAddress(await getAccountAddress());
      setBalance(await getAccountBalance());
      setInscriptions(await getAccountsInscriptions());
      setAddress(await getAddress());
      setShowWallet("show");
    } catch (e) {
      console.log("connect failed");
    }
  }

  // Gives the User the Ability to Copy their own Address
  function copyAddress() {
    navigator.clipboard.writeText(address[0]);
    message.success("Copied");
  }

  return (
    <>
      <p style={{ textAlign: "left", paddingLeft: "25px" }}>
        {accountsAddress}{" "}
        <Button
          className={showWallet}
          type="primary"
          style={{
            backgroundColor: "transparent",
            color: "#2b2a29",
            boxShadow: "none",
          }}
          onClick={copyAddress}
          icon={<CopyOutlined />}
        />
      </p>
    </>
  );
}

async function getAddress() {
  try {
    return await unisat.getAccounts();
  } catch (e) {
    console.log(e);
  }
}

// Get User's Account Address
async function getAccountAddress() {
  try {
    // User's Account
    const accountAddresses = await getAddress();

    const hiddenAddresses = accountAddresses.map((addr: string) => {
      // User's Account Sliced
      const firstFourDigits = addr.slice(0, 4);
      const middleDigits = "...";
      const lastFourDigits = addr.slice(-4);

      // User's Account Hidden
      let hiddenAccountAddress =
        firstFourDigits + middleDigits + lastFourDigits;
      return hiddenAccountAddress;
    });

    return hiddenAddresses;
  } catch (e) {
    console.log("error in getting account info");
  }
}

// Get User's Account Balance
async function getAccountBalance() {
  try {
    const balance = await unisat.getBalance();
    console.log("BALANCE: ", balance);
    return balance;
  } catch (e) {
    console.log(e);
  }
}

// Get User's List of Inscriptions
async function getAccountsInscriptions() {
  try {
    const inscriptions = await unisat.getInscriptions();
    console.log("INSCRIPTIONS: ", inscriptions);

    if (inscriptions.list.length === 0) {
      console.log("YOU HAVE NO INSCRIPTIONS");
    }

    return inscriptions;
  } catch (e) {
    console.log(e);
  }
}

export default Wallet;

/*
-------------------- References --------------------
Window Compatible with TypeScript - https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window
UniSat Wallet API - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet
Icon - https://ant.design/components/icon
Message - https://ant.design/components/message
Button - https://ant.design/components/button
*/
