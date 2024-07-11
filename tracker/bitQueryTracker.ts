import {getLastXDaysHoursFormatted, queryTransactions, queryTransactionsMock} from "./QueryTransactions";

// TODO is it possible to limit the number per address

// "BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ",

// limit 1000 = 32 points
// limit 1000 = 8 points

// iteration 15 addresses
// 38 addresses total

// 15 addresses * 2 * 8 * 30 = 7200 points

const addresses = [
    "CXGpHdDLrnzrKY1ukvgNKM8soZhzdL5Trx5bXQdeCHVL",
    "8CGJPWdM7xZX5E2ZE7qw5TiNUgpLyUeXJAnHr5goezeD",
    "DVMnHHwq9SNxj4Bhd8mim1AacXfPemu6WsK8ox7Vexhg",
    "J7pMJuvFoNni6UxAavxZ26zH39gzjUS57NKNiAvezetj",
    "H4yHKvbqethH5CFwc5DUjErHETWQcDBSyB2vkXbdGX7r",
    "CRRf1zgmgbn5UfBp6sSsdjHAqCXFQRUzKaN2ni19Dgvk",
    "j1oAbxxiDUWvoHxEDhWE7THLjEkDQW2cSHYn2vttxTF",
    "356JHc8eZFYF1FKkcKtjNHfSQxhPzPtBEsgJEazS95Et",
    "Du6KcjYDAsyBtMQTPd7ndhD6N7nb7TMoimgZtwvo3hDa",
    "8yNf3DbJYoRqfxRHZTUduJPaBYQHpAjs7XSskpkrKxBg",
    "BdwdDJuTw9tS2o6GEaCSESwKg1PXPASRumErm2VEMEjD",
    "AG6YJF7iH1R5io1RtyjmKcyWjYPnmSP2zBuSRBawbNhG",
    "3JNXb6rcKiswc1d1FfrBFV7TqSFKLGRFFoXMcxCW3VNY",
    "3LDFRAVq88XTvUtUnz6xGWisB9ALhLFKfSxeaKzAFLX7",
    "DLocg6wustgRS8sVd9grj3smUWmw3M6sSJrydgXWrAUC",
    "FmhDonUB11n5WyRCDEpxnNJhXDVw1JX1XJSD72ssQFhB"
]

const track = async () => {
    const trxs = await queryTransactions(addresses);
    // const trxs = await queryTransactionsMock();
    // console.log('trxs', JSON.stringify(trxs, null, 4));

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

    const sortedCurrencies = uniqueItemsWithCount.sort((a, b) => (b as any).count - (a as any).count);

    console.log('Top 10 Currencies', sortedCurrencies.slice(0, 10));

}

track();

// const since = getLastXDaysHoursFormatted(2);
// console.log('requesting trx since', since);