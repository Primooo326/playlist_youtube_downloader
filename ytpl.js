const ytpl = require('ytpl');


async function init() {

    const firstResultBatch = await ytpl('PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K', { pages: 10000 });
    const secondResultBatch = await ytpl('PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K');

    console.log(firstResultBatch.estimatedItemCount);
    console.log(firstResultBatch.items[0]);

}
init()