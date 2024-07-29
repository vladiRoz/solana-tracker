import WebSocket from 'ws';
import { NewToken } from "../consts.type";
import { sendTransaction } from "./pump-portal";
import fs from 'fs';

const WS_URL = 'wss://pumpportal.fun/api/data';

const ACTIVE_COINS = 1;
const ONE_TIME = true;
const BUY_AMOUNT = 0.055; // ~10$

// at what hours/timezone usually there is more volume activity?
// 1. 12-3am est -> 2pm - 5pm sydney
// 2. 7am-12 est -> 9pm -> 2am sydney


// TODO filter something for first time
// put money in the bank
// open postman have a sell order ready in case of issues

// line 100 - todo check the error screen shot and update this

const NAME_FILTER = [];

export class TradingBot {
    // private apiClient: Api;
    public ws: WebSocket;
    private activePromises: Map<string, Promise<void>> = new Map();
    public purchaseData: Map<string, any> = new Map();
    private loopIndex = 0;

    constructor() {
        // this.apiClient = new Api();
        this.ws = new WebSocket(WS_URL);
    }

    public init() {
        this.ws.on('message', this.handleNewCoin.bind(this));
        this.ws.on('open', () => {
            this.ws.send(JSON.stringify({
                method: "subscribeNewToken",
            }));
        });
    }

    private async handleNewCoin(data: WebSocket.Data) {
        const newCoin = JSON.parse(data.toString());
        if (newCoin.message){
            // "Successfully subscribed to token creation events."
            return;
        }

        console.log('newCoin', newCoin);

        if (this.coinNameFilter(newCoin.name, NAME_FILTER)) {
            return;
        }

        if (ONE_TIME && this.loopIndex === 1) {
            console.log('ONE_TIME trx');
            return;
        }
        this.loopIndex++;

        if (this.activePromises.size < ACTIVE_COINS) {
            console.log('index: ', this.activePromises.size);
            const promise = this.handleCoin(newCoin);
            this.activePromises.set(newCoin.name, promise);

            promise.finally(() => {
                console.log('removed', newCoin.name);
                this.activePromises.delete(newCoin.name);
            });
        }
    }

    public coinNameFilter(name: string, words: string[]) {
        if (words.length === 0) {
            return false;
        }
        const regex = new RegExp(words.join('|'), 'i');
        return regex.test(name);
    }

    private async handleCoin(coin: NewToken): Promise<void> {
        return new Promise(async (resolve) => {

            console.log('buy request, mint: ', coin.mint);

            const buyTime1 = Date.now();
            const buyResponse: any = await sendTransaction({
                action: "buy",
                mint: coin.mint,
                amount: BUY_AMOUNT,
            });
            const buyTime2 = Date.now();
            this.purchaseData.set(coin.mint, {
                buy: {
                    times: { buyTime1, buyTime2, executionTime: buyTime2 - buyTime1 },
                    response: buyResponse,
                }
            });

            console.log('buyResponse', buyResponse);

            if (buyResponse === null || buyResponse?.errors) {
                resolve();
                return;
            }

            const checkGain = setTimeout(async () => {
                clearInterval(checkGain);

                console.log('sell request, mint: ', coin.mint);

                const sellTime1 = Date.now();
                const sellResponse = await sendTransaction({
                    action: "sell",
                    mint: coin.mint,
                    amount: "100%",
                });
                const sellTime2 = Date.now();
                const purchaseData = this.purchaseData.get(coin.mint);
                this.purchaseData.set(coin.mint, {
                    sell: {
                        ...purchaseData,
                        times: { sellTime1, sellTime2, executionTime: sellTime2 - sellTime1 },
                        response: sellResponse,
                    }
                });

                console.log('sellResponse', sellResponse);
                resolve();
            }, 3000);
        });
    }

    public dumpDataToFile(filePath: string) {
        let existingData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            if (fileContent.trim()) {
                existingData = JSON.parse(fileContent);
            }
        }
        const newData = Object.fromEntries(this.purchaseData.entries());
        const mergedData = { ...existingData, ...newData };
        fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2), 'utf-8');
        console.log(`Data appended to ${filePath}`);
    }
}