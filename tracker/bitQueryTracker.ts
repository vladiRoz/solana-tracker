import {queryTransactions, queryTransactionsMock} from "./QueryTransactions";

const addresses = [
    "BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ",
    "CXGpHdDLrnzrKY1ukvgNKM8soZhzdL5Trx5bXQdeCHVL"
]

const track = async () => {
    // const trxs = await queryTransactions(addresses);
    const trxs = await queryTransactionsMock();
    console.log('trxs', JSON.stringify(trxs, null, 4));

    const { transfers } = trxs.data.solana;

    if (!transfers || !transfers.length) {
        console.log('no transfers');
        return;
    }

    const currencies = transfers.map((transfer: any) =>
        ({name: transfer.currency.name, address: transfer.currency.address})).filter(transfer => transfer.name !== "-")

    const addressCount = currencies.reduce((acc, item) => {
        acc[item.address] = (acc[item.address] || 0) + 1;
        return acc;
    }, {});

    const uniqueItemsWithCount: any[] = [];
    currencies.forEach(transfer => {
        const existingItem = uniqueItemsWithCount.find(item => (item as any).address === transfer.address);
        if (!existingItem) {
            uniqueItemsWithCount.push({ ...transfer, count: addressCount[transfer.address] });
        }
    });

    console.log('uniqueItemsWithCount', uniqueItemsWithCount);

}

track();