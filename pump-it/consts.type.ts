export enum TradeStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    BOUGHT = 'BOUGHT',
    SUCCESS = 'SUCCESS',
}

export interface Coin {
    name: string;
    price: number;
}