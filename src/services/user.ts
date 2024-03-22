import axios from 'axios';
const API = "http://localhost:3000";

const getHoldings = (address: string) => {
    const request = axios.get(
        API + `/holdings?address=${address}`
    );
    return request.then(res => res.data);
}

const getOrders = (address: string) => {
    const request = axios.get(
        API + `/orders?address=${address}`
    );
    return request.then(res => res.data);
}

export default { getHoldings, getOrders }
