import { TradingBot } from '../trading-bot';

describe('TradingBot', () => {
    let bot: TradingBot;

    beforeEach(() => {
        bot = new TradingBot();
    });

    test('coinNameFilter should return true for matching words', () => {
        const words = ["neiro", "bitcoin", "ethereum"];
        expect(bot.coinNameFilter("NEIROISM", words)).toBe(true);
    });

    test('coinNameFilter should return false for non-matching words', () => {
        const words = ["neiro", "bitcoin", "ethereum"];
        const name = "Litecoin";
        expect(bot.coinNameFilter(name, words)).toBe(false);
    });

    test('coinNameFilter should be case insensitive', () => {
        const words = ["neiro"];
        const name = "NEIRO";
        expect(bot.coinNameFilter(name, words)).toBe(true);
    });

    test('coinNameFilter shouldnt filter when array empty', () => {
        const words = [];
        const name = "NEIRO";
        expect(bot.coinNameFilter(name, words)).toBe(false);
    });
});