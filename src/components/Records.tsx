export type Record = {
    id: number,
    address: string,
    action: string,
    token_size: number,
    token: string,
    price?: number,
    fee?: number,
    btc_amount?: number,
    datetime: string
}

function Records({ records }: { records: Record[] }) {
    if (records.length === 0) {
        return (<p>No records.</p>)
    }

    return (
        <div>
            {records.map(
                (record) => {
                    let date = new Date(record.datetime);
                    let price: string = (record.price) ? `${record.price}` : "market price";
                    return (<p>{record.action} {record.token_size} {record.token} at {price} <em>(Updated {date.toLocaleString()})</em></p>)
                })}
        </div>
    )
}

export default Records;
