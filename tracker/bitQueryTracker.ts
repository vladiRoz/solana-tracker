import {queryTransactions, queryTransactionsMock} from "./QueryTransactions";

const addresses = [
    "BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ",
]

const track = async () => {
    // const trxs = await queryTransactions(addresses);
    const trxs = await queryTransactionsMock();
    console.log('trxs', JSON.stringify(trxs, null, 4));

    const { transfers } = trxs.data.solana;
    if (transfers.length) {
        const currencies = transfers.map((transfer: any) =>
            ({name: transfer.currency.name, address: transfer.currency.address}));
        console.log('currencies', currencies);
    }

}

track();