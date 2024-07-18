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

const convertUnixToTimestamp = (unixTimestamp, includeSeconds = true) => {
    const date = new Date(unixTimestamp);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (includeSeconds) {
        return `${hours}:${minutes}:${seconds}, ${day}.${month}.${year}`;
    } else {
        return `${hours}:${minutes}, ${day}.${month}.${year}`;
    }
};

const getNextDayByDateString = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
}


module.exports = { waitMs, snowflakeToDate, msToHumanReadableTime, convertUnixToTimestamp, getNextDayByDateString };