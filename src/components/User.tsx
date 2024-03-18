import { useEffect, useState } from 'react';
import userService from '../services/user';
import Holdings from './Holdings';
import Orders from './Orders';


function User({ address }: { address: string }) {
    const [holdings, setHoldings] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchHoldings = () => {
        userService
            .getHoldings(address)
            .then(data => {
                setHoldings(data)
            });
    }

    useEffect(fetchHoldings, []);

    /*
    Orders API not implemented yet
    const fetchOrders = () => {
        userService
            .getOrders(address)
            .then(data => {
                setOrders(data)
            });
    }

    useEffect(fetchOrders, []);
    */

    return (
        <div>
            <h3>Holdings</h3>
            <Holdings holdings={holdings} />
            <br />

            <h3>Outstanding Orders</h3>
            <Orders orders={orders} />
        </div>
    )
}

export default User;
