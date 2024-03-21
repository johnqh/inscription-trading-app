import React, { useState, useEffect } from "react";

function Wallet( props: {accounts: string[]}) {
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

  useEffect(() => {
    connectWallet();
  }, [props.accounts]);

  // Connecting to User's UniSat Wallet
  async function connectWallet() {
    let alertMsg =
      "You don't have the UniSat Wallet Extension installed.\nYou need to download this extension on the Google Chrome web store to interact with this website.";

    // Verifies if the User is Running a Browser with the UniSat Wallet Extension
    if (typeof unisat === "undefined") return alert(alertMsg);

    try {
      console.log("UniSat Wallet is installed!");
      // const accounts = await unisat.requestAccounts();
      // console.log("connect success", accounts);

      // Get User's Account Info
      setAccountsAddress(await getAccountAddress());
      setBalance(await getAccountBalance());
      setInscriptions(await getAccountsInscriptions());
      showBalance = "show";
    } catch (e) {
      console.log("connect failed");
    }
  }

  let showBalance = "hide";

  return (
    <>
      <p>{accountsAddress}</p>
      <p className={showBalance}>{balance.total}</p>
      <p>{inscriptions.list}</p>
    </>
  );
}

const unisat = (window as any).unisat;

// Get User's Account Address
async function getAccountAddress() {
  try {
    // User's Account
    const accountAddresses = await unisat.getAccounts();

    const hiddenAddresses = accountAddresses.map((addr: string) => {
      // User's Account Sliced
      const firstFourDigits = addr.slice(0, 4);
      const middleDigits = addr.slice(4, -4);
      const lastFourDigits = addr.slice(-4);

      let middleDigitsHidden: string = "";

      // Replace Middle Digits with '*'
      for (let i = 0; i < middleDigits.length; i += 1) {
        middleDigitsHidden += "*";
      }

      // User's Account Hidden
      let hiddenAccountAddress =
        firstFourDigits + middleDigitsHidden + lastFourDigits;
        return hiddenAccountAddress;
    })

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
*/
