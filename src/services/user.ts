import axios from "axios";
const API = "http://localhost:3000";

const getHoldings = async (address: string) => {
  try {
    const request = await axios.get(API + `/holdings?address=${address}`);
    return request.data;
  } catch (e) {
    console.log(e);
  }
};

const getOrders = async (address: string) => {
  try {
    const request = await axios.get(API + `/orders?address=${address}`);
    return request.data;
  } catch (e) {
    console.log(e);
  }
};

export default { getHoldings, getOrders };
