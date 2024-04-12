import axios from "axios";
const API = "http://localhost:3000";

const getHoldings = async (address: string) => {
  try {
    const request = await axios.get(API + `/holdings?address=${address}`);
    return request.data;
  } catch (e) {
    console.log(e);

    // If the API can't get holdings for an address, likely cause is a bad API
    // key
    if (address) {
      alert(`Unable to fetch holdings for address ${address}, try again later`);
    }
    return [];
  }
};

const getOrders = async (address: string) => {
  try {
    const request = await axios.get(API + `/orders?address=${address}`);
    return request.data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default { getHoldings, getOrders };