import { Server as WebSocketServer } from 'ws';
import WebSocket from 'ws';
import {Coin, TradeStatus} from "../consts.type";

class Api {
    private wss: WebSocketServer | undefined;

    public init(port: number) {
        this.wss = new WebSocketServer({ port });
    }

    public start() {
        this.initializeServer();
    }

    private initializeServer() {
        if (!this.wss) {
            console.error('WebSocket server not initialized');
            return;
        }
        this.wss.on('connection', (ws) => {
            this.generateNewCoins(ws);
        });
        console.log(`Mock wb server running on ws://localhost:${this.wss.options.port}`);
    }

    private generateNewCoins(ws: WebSocket) {
        setInterval(() => {
            const newCoin = {
                name: `Coin_${Math.random().toString(36).substring(7)}`,
                price: Math.random() * 100,
            };
            ws.send(JSON.stringify(newCoin));
        }, 1000); // Generate a new coin every second
    }

    public getPrice(coin: Coin): number {
        // Mock price fluctuation
        return coin.price * (1 + (Math.random() - 0.5) * 0.2); // Fluctuate +/- 10%
    }

    public buyCoin(coin: Coin): TradeStatus {
        console.log(`Bought ${coin.name} at ${coin.price}`);
        return TradeStatus.SUCCESS;
    }

    public sellCoin(coin: Coin): TradeStatus {
        const sellPrice = this.getPrice(coin);
        console.log(`Sold ${coin.name} at ${sellPrice}`);
        return TradeStatus.SUCCESS;
    }
}

export default Api;
