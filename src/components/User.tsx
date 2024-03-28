import { useEffect, useState } from 'react';
import userService from '../services/user';
import Holdings from './Holdings';
import Orders from './Orders';


function User({ address }: { address: string }) {
    const [holdings, setHoldings] = useState([]);
    const [orders, setOrders] = useState([]);


    const getAddress = async () => {
        if (!address) {
            let unisat = (window as any).unisat;
            let x = await unisat.getAccounts();
            return x[0];
        } else {
            return address;
        }
    }

    useEffect(() => {
        // Set the address
        getAddress()
            .then(data => {
                address = data;
                console.log(address)
            });

        // set the holdings
        userService
            .getHoldings(address)
            .then(data => {
                setHoldings(data);
            });

        // Set the orders
        userService
            .getOrders(address)
            .then(data => {
                setOrders(data);
            });
    });

    if (!address) {
        return (<p>Wallet not connected</p>);
    }

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
