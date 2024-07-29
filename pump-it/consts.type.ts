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

export type NewToken = {
    signature: string;
    mint: string;
    traderPublicKey: string;
    txType: 'create';
    initialBuy: number;
    bondingCurveKey: string;
    vTokensInBondingCurve: number;
    vSolInBondingCurve: number;
    marketCapSol: number;
    name: string;
    symbol: string;
    uri: string;
};