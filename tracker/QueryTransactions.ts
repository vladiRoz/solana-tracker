import axios from 'axios';

// Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB - TUSD
const query =
    `query ($network: SolanaNetwork!, $limit: Int!, $after: ISO8601DateTime, $receiver: [String!], $amountInUSD: Float!) {
          solana(network: $network) {
            transfers(
              options: {limit: $limit, desc: "block.timestamp.iso8601"}
              date: {after: $after}
              receiverAddress: {in: $receiver}
              transferType: {is: transfer}
              success: {is: true}
              amountInUSD: {gt: $amountInUSD}
              currency: {notIn: ["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"]}
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

export const queryTransactions = async (addresses: string[]) => {

    const variables = {
        "limit": 3,
        "network": "solana",
        "receiver": addresses,
        "after": "2024-07-05",
        "amountInUSD": 1
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
    const demoResponse = {
        "data": {
            "solana": {
                "transfers": [
                    {
                        "transaction": {
                            "signature": "3j8zVVdZLokSMEVnHQNEaBXsQNpx4M8Uerr3jgaQHD42ctqek6UH4ZMX9Y45GqJH2Zr1MK34cMkcR4zxXLRhKjPQ"
                        },
                        "currency": {
                            "name": "Hawk Tuah",
                            "symbol": "HAWKTUAH",
                            "address": "4GFe6MBDorSy5bLbiUMrgETr6pZcjyfxMDm5ehSgpump"
                        },
                        "any": "2024-07-08 22:27:13 UTC",
                        "block": {
                            "timestamp": {
                                "iso8601": "2024-07-08T22:27:13Z"
                            }
                        }
                    },
                    {
                        "transaction": {
                            "signature": "4tPo9TpWV7ChpfNRqBc9DQnc6tcAWH2YTWrRWtmuFEb7iKce7oDugwE1jyqrtaTt1pnLdRbCauau8sK1JbmDdvSD"
                        },
                        "currency": {
                            "name": "Wrapped Solana",
                            "symbol": "SOL",
                            "address": "So11111111111111111111111111111111111111112"
                        },
                        "any": "2024-07-08 22:26:38 UTC",
                        "block": {
                            "timestamp": {
                                "iso8601": "2024-07-08T22:26:38Z"
                            }
                        }
                    },
                    {
                        "transaction": {
                            "signature": "58JQ5i4krB5s2LJDHQBvmsH8hemBrjgDuHyDwg6YoNSVp3Sq3DY84t6hHvS7rKb8gbgkYQY1XrcBo476ZCrQi4LR"
                        },
                        "currency": {
                            "name": "Hawk Tuah",
                            "symbol": "HAWKTUAH",
                            "address": "4GFe6MBDorSy5bLbiUMrgETr6pZcjyfxMDm5ehSgpump"
                        },
                        "any": "2024-07-08 14:03:59 UTC",
                        "block": {
                            "timestamp": {
                                "iso8601": "2024-07-08T14:03:59Z"
                            }
                        }
                    }
                ]
            }
        }
    }
    return Promise.resolve(demoResponse);
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
