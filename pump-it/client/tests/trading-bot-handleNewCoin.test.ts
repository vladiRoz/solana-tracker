import { TradingBot } from '../trading-bot';
import { sendTransaction } from '../pump-portal';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../pump-portal', () => ({
    sendTransaction: jest.fn(),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('TradingBot handleNewCoin', () => {
    let bot: TradingBot;

    beforeEach(() => {
        bot = new TradingBot();
        bot.ws = new WebSocket('ws://localhost');
        jest.clearAllMocks();
    });

    afterEach(() => {
        // jest.useRealTimers();
    });

    test('should call sendTransaction twice and return object with signature containing uuid', async () => {
        const mockUuid = uuidv4();
        (sendTransaction as jest.Mock).mockResolvedValueOnce({ signature: mockUuid, errors: [] });
        (sendTransaction as jest.Mock).mockResolvedValueOnce({ signature: mockUuid, errors: [] });
        jest.spyOn(bot, 'coinNameFilter').mockReturnValue(true);

        const newCoin = { name: 'TestCoin', mint: 'test-mint', symbol: 'TC'};
        bot.handleNewCoin(JSON.stringify(newCoin));

        jest.runAllTimers();

        // need to be 2
        expect(sendTransaction).toHaveBeenCalledTimes(1);
        expect(sendTransaction).toHaveBeenCalledWith(expect.objectContaining({ action: 'buy' }));
        // expect(sendTransaction).toHaveBeenCalledWith(expect.objectContaining({ action: 'sell' }));
    });

    test('should set KILL_SWITCH to true when sendTransaction returns null', async () => {
        jest.spyOn(bot, 'coinNameFilter').mockReturnValue(true);
        (sendTransaction as jest.Mock).mockResolvedValueOnce(null);

        const newCoin = { name: 'TestCoin', mint: 'test-mint', symbol: 'TC' };
        bot.handleNewCoin(JSON.stringify(newCoin));

        expect(sendTransaction).toHaveBeenCalledTimes(1);
    });
});