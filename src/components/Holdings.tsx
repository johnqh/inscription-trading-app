export type Holding = {
    tick: string,
    address: string,
    amt: number,
    updated_at_block: number
}

function Holdings({ holdings }: { holdings: Holding[] }) {

    if (holdings.length == 0) {
        return (<p>No holdings.</p>);
    }

    return (
        <div>
            {holdings.map(
                (holding) => {
                    return (<p>{holding.tick}: {holding.amt} <em>Since block {holding.updated_at_block}</em></p>)
                }
            )}
        </div>
    );
}

export default Holdings;
