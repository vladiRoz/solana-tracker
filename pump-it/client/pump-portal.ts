import axios from "axios";

// 50$ trade
// 0.5% trade fee before slippage = 0.25$
// slippage 2% = 1$
// MEGA_FEE = 3.7$
// total 5$ max per trade with MEGA_FEES

// total with 2.64$ with TURBO_FEES
// total with 1.83$ with FASTER_FEES = 3.66$ for 2 trades

const FAST_FEE = 0.0015; // 0.28$
const FASTER_FEE = 0.003; // 0.55$
const SUPER_FEE = 0.0051; // 0.55$
const TURBO_FEE = 0.0075; // 1.39$
const MEGA_FEE = 0.02; // 3.7$, 1 sec trx

// needs to be lower when live
const TIMEOUT = 5000;

const TRX_URL = "https://pumpportal.fun/api/trade?api-key=5x0kep3cd1nq6vjka1tpyd3nena78ta9e11n6xke9t74ukumf5kk4x2f65x4ackc5dpqgchha95n8ck48tp5apj1c4u42jv69nnmpuv7b9qm6j3fe4r5jkanenumpwa39t276wkaewykuancm6ykde9cqcvhbcrv3aha46m893pjtj95wv4etbdedgneu2q8ngn4hjna10kuf8";

export type PumpPortalTransaction = {
    action: "buy" | "sell",
    mint: string,
    amount: number | string,
    denominatedInSol?: boolean,
    slippage: number,
    priorityFee?: number,
    pool?: "pump" | "raydium"
}

export const sendTransaction = async (trxData: PumpPortalTransaction) => {
    try {
        console.log('sending trx', trxData);
        const response = await axios.request({
            method: 'post',
            url: TRX_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: TIMEOUT,
            data: JSON.stringify({
                "action": trxData.action,                     // "buy" or "sell"
                "mint": trxData.mint,                         // contract address of the token you want to trade
                "amount": trxData.amount,                     // amount of SOL or tokens to trade
                "denominatedInSol": "true",                   // "true" if amount is SOL, "false" if amount is tokens
                "slippage": trxData.slippage,                                // percent slippage allowed
                "priorityFee": SUPER_FEE,                         // amount to use as Jito tip or priority fee
                "pool": "pump"                                // exchange to trade on. "pump" or "raydium"
            }),
        });

        return response.data;

    } catch (error) {
        // maybe timeouts will be handled here
        // throw to force exit the bot, there is no point of continuing
        console.log('exception for: ',trxData.mint, ' error: ', error);
        return null;
    }
}