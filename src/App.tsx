import React, {useState, useEffect} from 'react';
import './App.css';
import Wallet from './components/Wallet';
import Market from "./components/Market";
import logo from "./images/Zorro Cat Logo.png";



function App() {
  let [accounts, setAccounts] = useState<string[]>([])

  async function connectWallet()
  {
    try {

    
      let alertMsg =
        "You don't have the UniSat Wallet Extension installed.\nYou need to download this extension on the Google Chrome web store to interact with this website.";

      // Verifies if the User is Running a Browser with the UniSat Wallet Extension
      if (typeof (window as any).unisat === "undefined") return alert(alertMsg);
      
      setAccounts(await (window as any).unisat.requestAccounts());
    } catch (e) {
      console.log("connect failed");
    }
  }

  return (
    <div className="App">
      <nav>
        <img id="logo" src={logo} alt="logo"></img>
        <div className="button-wrapper">
              <button id="wallet" onClick={connectWallet}>Connect</button>
        </div>
    
      </nav>
      <div className="panel-wrapper">
        <div className="panel left-panel">
          <Wallet accounts={accounts}></Wallet>
          <Market></Market>
        </div>
        <div className="panel middle-panel"></div>
        <div className="panel right-panel"></div>
      </div>
    </div>
  );
}

export default App;
