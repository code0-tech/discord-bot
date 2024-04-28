const keyArray = (input) => {
    const keysIterator = input.keys();
    return Array.from(keysIterator);
}

module.exports = { keyArray };