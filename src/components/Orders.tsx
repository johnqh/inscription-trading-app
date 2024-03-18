export type Order = {
    id: number,
    address: string,
    tick: string,
    side: number,
    amt: number,
    price: number,
    expiration: string,
    expired: number
}

function Orders({ orders }: { orders: Order[] }) {
    if (orders.length == 0) {
        return (<p>No orders.</p>);
    }

    return (
        <div>
            {orders.map(
                (order) => {
                    const expString = (order.expired) ? "Expired" : "Expires on ${order.expiration}";
                    return (<p>{order.tick}: {order.amt} at {order.price} \t <em>{expString}</em></p>)
                })
            }
        </div>
    )
}

export default Orders;
