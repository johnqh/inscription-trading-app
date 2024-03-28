import axios from 'axios';
const API = "http://localhost:3000";

const getHoldings = async (address: string) => {
    const request = await axios.get(
        API + `/holdings?address=${address}`
    );
    return request.data;
}

const getOrders = async (address: string) => {
    const request = await axios.get(
        API + `/orders?address=${address}`
    );
    return request.data;
}

export default { getHoldings, getOrders }
