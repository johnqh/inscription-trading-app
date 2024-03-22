import React, { useState, useEffect } from "react";
import axios from "axios"; // HTTP requests

let apiPrefix = "http://localhost:3000";

function Market() {
  const [tokenElements, setTokenElements] = useState<any[]>([]);

  async function getTokens() {
    let url = apiPrefix + "/deploy";
    let response = await axios.get(url);

    console.log(response.data);
    const tokens = response.data;

    const elements = [];

    for (let token of tokens) {
      elements.push(
        <div>
          <span>{token.tick}</span>
        </div>
      );
    }
    console.log(elements);
    setTokenElements(elements);
  }

  // Makes Sure Updates Only Happen Once
  useEffect(() => {
    getTokens();
  }, []);

  return (
    <>
      <div>{tokenElements}</div>
    </>
  );
}

export default Market;
