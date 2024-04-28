const waitMs = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const snowflakeToDate = (id) => {
    EPOCH_OFFSET = 1420070400000; // Discord epoch (2015-01-01)

    const timestamp = (id / 4194304) + EPOCH_OFFSET;

    return timestamp;
}

const msToHumanReadableTime = (ms) => {
    const secondsAgo = Math.floor(ms / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    return { s: (secondsAgo % 60), m: (minutesAgo % 60), h: (hoursAgo % 24), d: daysAgo };
}


module.exports = { waitMs, snowflakeToDate, msToHumanReadableTime };