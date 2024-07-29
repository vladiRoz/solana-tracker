import { TradingBot } from '../trading-bot';
import fs from 'fs';

jest.mock('fs');

describe('TradingBot - dumpDataToFile', () => {
    let bot: TradingBot;

    beforeEach(() => {
        bot = new TradingBot();
    });

    test('should write purchase data to file', () => {
        const filePath = 'testData.json';
        const coinMint = 'testMint';
        const buyTime1 = Date.now();
        const buyTime2 = buyTime1 + 1000;

        bot.purchaseData.set(coinMint, { buyTimes: { buyTime1, buyTime2, executionTime: buyTime2 - buyTime1 } });

        bot.dumpDataToFile(filePath);

        const expectedData = JSON.stringify(Array.from(bot.purchaseData.entries()), null, 2);
        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedData, 'utf-8');
    });
});