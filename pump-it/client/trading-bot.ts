// tradingBot.ts
import WebSocket from 'ws';
import Api from "../server/api";
import {TradeStatus} from "../consts.type";

interface Coin {
    name: string;
    price: number;
}

class TradingBot {
    private apiClient: Api;
    private ws: WebSocket;
    private activePromises: Map<string, Promise<void>> = new Map();

    constructor(url: string) {
        this.apiClient = new Api();
        this.ws = new WebSocket(url);
        this.ws.on('message', this.handleNewCoin.bind(this));
        this.ws.on('open', () => console.log('Connected to web socket'));
    }

    private async handleNewCoin(data: WebSocket.Data) {
        const newCoin: Coin = JSON.parse(data.toString());

        if (this.activePromises.size < 10) {
            console.log('new coin', newCoin.name, ', index: ', this.activePromises.size);
            const promise = this.handleCoin(newCoin);
            this.activePromises.set(newCoin.name, promise);

            promise.finally(() => {
                console.log('removed', newCoin.name);
                this.activePromises.delete(newCoin.name);
            });
        }
    }

    private async handleCoin(coin: Coin): Promise<void> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const status = this.apiClient.buyCoin(coin);
            if (status !== TradeStatus.SUCCESS) {
                resolve();
                return;
            }

            const initialPrice = coin.price;

            const checkGain = setInterval(() => {
                const currentPrice = this.apiClient.getPrice(coin);
                const elapsedTime = Date.now() - startTime;

                if (currentPrice >= initialPrice * 1.1 || elapsedTime >= 3000) {
                    clearInterval(checkGain);
                    this.apiClient.sellCoin(coin);
                    resolve();
                }
            }, 100); // Check every 100ms
        });
    }
}

const bot = new TradingBot('ws://localhost:8080');
