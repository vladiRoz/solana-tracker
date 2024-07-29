import {getLastXDaysHoursFormatted, queryTransactions, queryTransactionsMock} from "./QueryTransactions";

// TODO is it possible to limit the number per address

// "BwHKbKPt4bMvaAk5Qvc97euhTMNXL6qCtNwG9vse6CFQ",

// limit 1000 = 32 points
// limit 1000 = 8 points

// iteration 15 addresses
// 38 addresses total

// 15 addresses * 2 * 8 * 30 = 7200 points

const addresses = [
    "4QhMTvWGBLRdpAbqfNEYd1tcDpmobF513VeEq7izzDqB", // 9unfKTfGhVyYjMEt9fRq1bfovhosse2gAFbYKbXipump - solid copy trade
    "9gDj8yWC8LtwiHF6QYjitz91k4a8RwNu3HxqL1SWHHU9", // CTJf74cTo3cw8acFP1YXF3QpsQUUBGBjh2k2e8xsZ6UL - might be https://x.com/punk1685
    "2Jsy3qmi5WrozQVFyrFPw5MzivovyULMHELXweMDaqFp", // 358PuxphAQ26nktpniGzcooT1u3TZEsE2HmWgQUMpump - copy trade - 167.49 SOL - 28/07
    "5ePaQ8YreTMQbNoBwiFe6mbvBLBYoGFek3U3pC8TVVsw", // 5ePaQ8YreTMQbNoBwiFe6mbvBLBYoGFek3U3pC8TVVsw - copy trade - 171.16 SOL - 28/07
    "F1vonrRFUrrxKaPAHxaP6ReSi9d5FxBjNdhuV6pTEyFC", // 5ePaQ8YreTMQbNoBwiFe6mbvBLBYoGFek3U3pC8TVVsw - copy trade - 342.26 SOL - 28/07 (trades werent best but he knows something)
    "AMcmpDC9en1vMkC59ykzXysqomcf86jdtNSLzmwj1sH1", // CTg3ZgYx79zrE1MteDVkmkcGniiFrK1hJ6yiabropump - copy trade (looks good) - 93.08 SOL 28/07
    "GQWLRHtR18vy8myoHkgc9SMcSzwUdBjJ816vehSBwcis", // CTg3ZgYx79zrE1MteDVkmkcGniiFrK1hJ6yiabropump - copy trade (looks good)
    "DGMPQVy8gYu2dBX7SHA1MpA4Cn6pRkG4jChPGM18gGX3", // 8sWKTMrh9bWUrvykK4H3jzEzGbEqvJNpS2f7joYKpump - copy trade - 31.34 SOL - 27/07
    "H3E21pVS4mTgnkk263iVzrpP9sdXTnnvK5QnV2nJk1UE", // 8sWKTMrh9bWUrvykK4H3jzEzGbEqvJNpS2f7joYKpump - copy trade - 207.42 SOL - 27/07
    "Ff3BRkhA1zZed5Qv9fDBZft6ndA1cSSmdUCfBLjtQ3E7", // 8sWKTMrh9bWUrvykK4H3jzEzGbEqvJNpS2f7joYKpump
    "DmdrUanasUnPEurAuVQuFZqn7oz3kDhNuW3ZydBjTJDS", // 8sWKTMrh9bWUrvykK4H3jzEzGbEqvJNpS2f7joYKpump - copy trade - 40.71 SOL - 27/07
    "HACi5dhfYE8KBXoqfacg6CzZraiSALHxsuz7kDT3Fntt", // 3jvkv27UDNCxz4Qxh8TKgRyLHK9tJzyfY91suYmjpump - copy trader - 5.7856 SOL - 27/07
    "AgVTPaga6QbCXYHUTNdjfzdbeoK5BKAuk6vJLofrNTBZ", // Ht8gxUd8s6KJHxs4yqWmmR5JJRtvpYaLWu4KAwC4pump
    "CqPguzDFD4MbJzz3Qd34K7rwc37hpCZtrZmtcaZ8EoZz", // Ht8gxUd8s6KJHxs4yqWmmR5JJRtvpYaLWu4KAwC4pump - entered with 3k size, maybe dev or insider
    "EksEBhXW1aSuBCodBbLzr6BERsKoyXtdhH7GhJkjDYSj", // Cnjm1nK2AK6U2vBZadmB8UY8T61BsZW3vcGSDRg8d6My
    "CeoqFgsd6sob3S1Ka7qDnXj1e76MweXx2cwUrjVqmRmv", // Cnjm1nK2AK6U2vBZadmB8UY8T61BsZW3vcGSDRg8d6My
    "EyFNAE7DYp2EiJBs4sw2MJfGDAfSHKbcytfSy6kx6XjK", // 4AKYKa4JLKQau7m8B7hmFdN8ur1SvqUDqJt6D44Npump
    "88ycMAV9iKedQaaVNYukKZxYuqdado6EzX1wa2XGJjME", // 3tjYEojjq5yD5ask6MKC2nA4Ben5bAYeheMbSRVjpump
]

const track = async () => {
    const trxs = await queryTransactions(addresses);
    // const trxs = await queryTransactionsMock();
    // console.log('trxs', JSON.stringify(trxs, null, 4));

    const { transfers } = trxs.data.solana;

    if (!transfers || !transfers.length) {
        console.log('no transfers');
        return;
    }

    const currencies = transfers.map((transfer: any) =>
        ({name: transfer.currency.name, address: transfer.currency.address})).filter(transfer => transfer.name !== "-")

    const addressCount = currencies.reduce((acc, item) => {
        acc[item.address] = (acc[item.address] || 0) + 1;
        return acc;
    }, {});

    const uniqueItemsWithCount: any[] = [];
    currencies.forEach(transfer => {
        const existingItem = uniqueItemsWithCount.find(item => (item as any).address === transfer.address);
        if (!existingItem) {
            uniqueItemsWithCount.push({
                ...transfer,
                count: addressCount[transfer.address],
                url: `https://dexscreener.com/solana/${transfer.address}`
            });
        }
    });

    const sortedCurrencies = uniqueItemsWithCount.sort((a, b) => (b as any).count - (a as any).count);

    console.log('Top 10 Currencies', sortedCurrencies.slice(20, 40));

}

track();

// const since = getLastXDaysHoursFormatted(2);
// console.log('requesting trx since', since);