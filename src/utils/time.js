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

const convertUnixToTimestamp = (unixTimestamp) => {
    const date = new Date(unixTimestamp);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${hours}:${minutes}:${seconds}, ${day}.${month}.${year}`;
};

module.exports = { waitMs, snowflakeToDate, msToHumanReadableTime,convertUnixToTimestamp };