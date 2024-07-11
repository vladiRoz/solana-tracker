import axios from 'axios';
import {subDays} from "date-fns/subDays";
import {format} from "date-fns/format";
import {response1} from "./Response1";

const query =
    `query ($limit: Int!, $since: ISO8601DateTime, $receiver: [String!], $amount: Float!, $ignoreCurrencies: [String!]) {
          solana(network: solana) {
            transfers(
              options: {limit: $limit, desc: "block.timestamp.iso8601"}
              date: {since: $since}
              receiverAddress: {in: $receiver}
              transferType: {is: transfer}
              success: {is: true}
              amount: {gt: $amount}
              currency: {notIn: $ignoreCurrencies}
            ) {
              transaction {
                signature
              }
              currency {
                name
                symbol
                address
              }
              any(of: time)
              block {
                timestamp {
                  iso8601
                }
              }
            }
          }
        }
    `;

export const getLastXDaysHoursFormatted = (days: number):string => {
    const last24Hours = subDays(new Date(), days);
    return format(last24Hours, 'yyyy-MM-dd\'T\'HH:mm:00');
}

export const queryTransactions = async (addresses: string[]) => {

    const since = getLastXDaysHoursFormatted(3);
    console.log('requesting trx since', since);

    const variables = {
        "limit": 1000,
        "receiver": addresses,
        "amount": 1000,
        since,
        "ignoreCurrencies": [
            "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
            "So11111111111111111111111111111111111111112",
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4",
            "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            "6DNSN2BJsaPFdFFc1zP37kkeNe4Usc1Sqkzr9C9vPWcU",
            "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
            "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
            "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
            "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
            "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"],
    }

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://graphql.bitquery.io',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYPAXnFlW3FtHCycflVL9UbwaTcGKzV',
            'Authorization': 'Bearer BQYPAXnFlW3FtHCycflVL9UbwaTcGKzV'
        },
        data: JSON.stringify({ query, variables }),
    };

    try {
        const response = await axios.request(config);
        if (response.status === 200) {
            if (response.data.errors) {
                console.error('error', response.data.errors);
                return [];
            }
            return response.data;
        }
        return [];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const queryTransactionsMock = async () => {
    // const demoResponse =  {
    //     "data": {
    //         "solana": {
    //             "transfers": [
    //                 {
    //                     "transaction": {
    //                         "signature": "vHnsFtPDpnbyhfWgY6AsJeLnYA5rz2iiz4fSfcTZw3ePA5LQ171m7F3hxNLBQ5bVA9fvGy9KQeNia8zZSyJquNY"
    //                     },
    //                     "currency": {
    //                         "name": "-",
    //                         "symbol": "-",
    //                         "address": "jWqoyb3itbujkhoiuuuMVsUHoCa1We1z5LF8voyN1Ra"
    //                     },
    //                     "any": "2024-07-09 13:40:30 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-09T13:40:30Z"
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "transaction": {
    //                         "signature": "3j8zVVdZLokSMEVnHQNEaBXsQNpx4M8Uerr3jgaQHD42ctqek6UH4ZMX9Y45GqJH2Zr1MK34cMkcR4zxXLRhKjPQ"
    //                     },
    //                     "currency": {
    //                         "name": "Hawk Tuah",
    //                         "symbol": "HAWKTUAH",
    //                         "address": "4GFe6MBDorSy5bLbiUMrgETr6pZcjyfxMDm5ehSgpump"
    //                     },
    //                     "any": "2024-07-08 22:27:13 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-08T22:27:13Z"
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "transaction": {
    //                         "signature": "4Kx7SCzUKNHGNgpCegTqqAmQWmstER4my1SVXoRG2TCAvpXWcNQKXtNdYPZPQbdTgmbEDsrvQwcyADq7R6FtmGg7"
    //                     },
    //                     "currency": {
    //                         "name": "-",
    //                         "symbol": "-",
    //                         "address": "B45QLZLZNwHo5ya5TQdjkE6A4xLCvNYvcRtjvFFZ9T72"
    //                     },
    //                     "any": "2024-07-08 14:54:51 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-08T14:54:51Z"
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "transaction": {
    //                         "signature": "58JQ5i4krB5s2LJDHQBvmsH8hemBrjgDuHyDwg6YoNSVp3Sq3DY84t6hHvS7rKb8gbgkYQY1XrcBo476ZCrQi4LR"
    //                     },
    //                     "currency": {
    //                         "name": "Hawk Tuah",
    //                         "symbol": "HAWKTUAH",
    //                         "address": "4GFe6MBDorSy5bLbiUMrgETr6pZcjyfxMDm5ehSgpump"
    //                     },
    //                     "any": "2024-07-08 14:03:59 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-08T14:03:59Z"
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "transaction": {
    //                         "signature": "2dXZi3tMBYXcH8zQfkRpGZXn4ygYMAbjKCmUU7CB3gmde27unrX1mT5Ki1btfc4ACCk1PCBexGPXnoC2aHAncSPZ"
    //                     },
    //                     "currency": {
    //                         "name": "-",
    //                         "symbol": "-",
    //                         "address": "6rThQfhir6PJXpgTBAY4K9dEhMZuLEajJmt6naQPNFau"
    //                     },
    //                     "any": "2024-07-07 11:28:43 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-07T11:28:43Z"
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "transaction": {
    //                         "signature": "9tBEnuBNsPcskhU5UhJcXZ2NfwdxqsGFginf1gsTUnoUiHFVYek4CkuothtzzHp2UM9bit68Fx8VNvV5Pu5TjyV"
    //                     },
    //                     "currency": {
    //                         "name": "Pepe On Crack",
    //                         "symbol": "PEPECRACK",
    //                         "address": "VqF9cfQ6eKmWjB4C1LYnoVS8iAXevPwqmAdSjXEpump"
    //                     },
    //                     "any": "2024-07-07 03:57:01 UTC",
    //                     "block": {
    //                         "timestamp": {
    //                             "iso8601": "2024-07-07T03:57:01Z"
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     }
    // };

    return Promise.resolve({ data: response1 });
}

//
// "query": "" +
// "query ($network: SolanaNetwork!, $limit: Int!, $after: ISO8601DateTime, $receiver: String!, $amountInUSD: Float!) {" +
// "\n  solana(network: $network) {" +
// "\n    transfers(" +
// "\n      options: {limit: $limit, desc: \"block.timestamp.iso8601\"}\n     " +
// "        date: {after: $after}\n      " +
// "        receiverAddress: {is: $receiver}\n      " +
// "        transferType: {is: transfer}\n     " +
// "        success: {is: true}\n      " +
// "        amountInUSD: {gt: $amountInUSD}\n     " +
// "        currency: {notIn: [\"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB\"]}\n    ) " +
// "{" +
// "\n      transaction {\n        signature\n      }\n      " +
// "        currency {\n        name\n        symbol\n        address\n      }\n      any(of: time)\n      block {\n        timestamp {\n          iso8601\n        }\n      }\n    }\n  }\n}\n",
//     "variables": "{\n  \"limit\": 3,\n  \"network\": \"solana\",\n  \"receiver\": \"BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ\",\n  \"after\": \"2024-07-05\",\n  \"amountInUSD\": 1\n}"


// backup

// query ($network: SolanaNetwork!, $limit: Int!, $after: ISO8601DateTime, $receiver: String!, $amountInUSD: Float!) {
//     solana(network: $network) {
//         transfers(
//             options: {limit: $limit, desc: "block.timestamp.iso8601"}
//         date: {after: $after}
//         receiverAddress: {is: $receiver}
//         transferType: {is: transfer}
//         success: {is: true}
//         amountInUSD: {gt: $amountInUSD}
//         currency: {notIn: ["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}
//     ) {
//             transaction {
//                 signature
//             }
//             currency {
//                 name
//                 symbol
//                 address
//             }
//             any(of: time)
//             block {
//                 timestamp {
//                     iso8601
//                 }
//             }
//         }
//     }
// }

// {
//     "limit": 3,
//     "network": "solana",
//     "receiver": "BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ",
//     "after": "2024-07-05",
//     "amountInUSD": 1
// }
