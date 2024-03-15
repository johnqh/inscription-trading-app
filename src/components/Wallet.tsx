import React from "react";

function Wallet() {
  return (
    <>
      <button
        type="button"
        onClick={connectWallet}
      >
        Connect
      </button>
    </>
  );
}

// Window Object - Represnts the Whole Browser
declare global {
  interface Window {
    unisat: any;
  }
}

async function connectWallet() {
  try {
    let accounts = await window.unisat.requestAccounts();
    console.log("connect success", accounts);
  } catch (e) {
    console.log("connect failed");
  }
}

export default Wallet;

/*
References
Window Compatible with TypeScript - https://stackoverflow.com/questions/56457935/typescript-error-property-x-does-not-exist-on-type-window
requestAccounts() - https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet
*/
