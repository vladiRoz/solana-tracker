import {TradingBot} from "./trading-bot";

const bot = new TradingBot();
bot.init();

process.on('SIGINT', () => {
    console.log('Process terminated. Closing WebSocket connection...');
    bot.dumpDataToFile('purchaseData.json');
    bot.ws.send(JSON.stringify({
        method: "unsubscribeNewToken",
    }));
    bot.ws.close();
    process.exit();
});
