import React from "react";

function Wallet() {
  return (
    <>
      <button
        // onPress={onPressLearnMore}
        type="button"
        onClick={connectWallet}
      >
        Click Me
      </button>
    </>
  );
}

declare global {
  interface Window {
    unisat: any;
  }
}

let unisat = window.unisat; // ok now

async function connectWallet() {
  console.log("HERE!!!!!");
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
