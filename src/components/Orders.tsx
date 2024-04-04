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
    if (orders.length === 0) {
        return (<p>No orders.</p>);
    }

    return (
        <div>
            {orders.map(
                (order) => {
                    let dateExp = new Date(order.expiration);
                    let side;
                    if (order.side) {
                        side = "Buy"
                    } else {
                        side = "Sell"
                    }
                    const expString = (order.expired) ? "Expired" : `Expires on ${dateExp.toLocaleString()}`;
                    return (<p>{side} {order.amt} {order.tick} at {order.price} <em>({expString})</em></p>)
                })
            }
        </div>
    )
}

export default Orders;
