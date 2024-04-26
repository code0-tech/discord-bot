const waitMs = (ms, obj = {}) => {
    return new Promise((resolve) => {

        setTimeout(() => {
            resolve(obj);
        }, ms);
    })
}

const snowflakeToDate = (id) => {
    EPOCH_OFFSET = 1420070400000; // Discord epoch (2015-01-01)

    const timestamp = (BigInt(id) >> 22n) + BigInt(EPOCH_OFFSET);

    const date = new Date(Number(timestamp));

    return date;
}


module.exports = { waitMs, snowflakeToDate };