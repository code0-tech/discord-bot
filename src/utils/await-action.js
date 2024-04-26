const awaiterCodeId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${random}`;
}

const awaitCodeResolve = (client, id, timeout = null, reference = null, referenceKill = false) => {
    return new Promise((resolve) => {
        if (referenceKill) killAllReferences(client, reference);

        let timeoutFunction = null;

        if (timeout !== null) {
            timeoutFunction = setTimeout(() => {
                delete client.awaitaction[id];
                resolve(false);
            }, timeout);
        }

        client.awaitaction[id] = { resolver: resolve, timeoutFunction, reference };
    });
};

const killAllReferences = (client, reference) => {
    Object.keys(client.awaitaction).forEach(key => {
        if (client.awaitaction[key].reference == reference) {
            client.awaitaction[key].resolver(null);
            delete client.awaitaction[key];
        }
    });
}

const triggerResolve = (client, id, data, removeReference = null) => {
    const action = client.awaitaction[id];

    if (action) {
        const { timeoutFunction, resolver } = action;

        if (timeoutFunction !== null) {
            clearTimeout(timeoutFunction);
        }

        resolver(data);
        delete client.awaitaction[id];
    }

    killAllReferences(client, removeReference);
};

// false = timeout
// null = killed by reference

module.exports = { awaiterCodeId, awaitCodeResolve, triggerResolve }