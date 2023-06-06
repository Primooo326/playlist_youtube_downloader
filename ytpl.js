const ytpl = require('ytpl');


async function init() {
    
        const firstResultBatch = await ytpl('PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K', { pages: 1 });
    let items = firstResultBatch.items.map(item => { 
        return item.shortUrl
    })
    console.log(items);

}
init()