console.dir(card.build(), { depth: null, breakLength: 0 });

const keysIterator = fetchedLogs.entries.keys(); // Access the 'entries' property first

const keysArray = Array.from(keysIterator);

keysArray.forEach(entryKey => {
    console.log(entryKey);
    console.log(snowflakeToDate(entryKey));
});