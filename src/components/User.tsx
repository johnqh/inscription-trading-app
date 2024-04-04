import { useEffect, useState } from 'react';
import userService from '../services/user';
import Holdings from './Holdings';
import Orders from './Orders';
import Records from './Records';


function User({ address }: { address: string }) {
    const [holdings, setHoldings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [records, setRecords] = useState([]);


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
                if (data != address) {
                    address = data;
                }
            });

        // set the holdings
        userService.getHoldings(address)
            .then(data => {
                setHoldings(data);
            });

        // Set the orders
        userService.getOrders(address)
            .then(data => {
                setOrders(data);
            });

        // Set the historical records
        userService.getRecords(address)
            .then(data => {
                setRecords(data);
            })
    }, [address]);

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

            <h3>Historical Records</h3>
            <Records records={records} />

        </div>
    )
}

export default User;
