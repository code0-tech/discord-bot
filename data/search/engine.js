const { searchData } = require('./search');

const levenshteinDistance = async (s1, s2) => {
    const m = s1.length, n = s2.length;
    if (m < n) return await levenshteinDistance(s2, s1);

    let previous = new Array(n + 1).fill(0).map((_, i) => i);
    let current = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
        current[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            current[j] = Math.min(
                previous[j] + 1,      // deletion
                current[j - 1] + 1,   // insertion
                previous[j - 1] + cost // substitution
            );
        }
        [previous, current] = [current, previous];
    }

    return previous[n];
};

const averageLevenshteinDistance = async (inputString, title, hashtags) => {
    const inputWords = inputString.split(' ');
    const titleWords = title.split(' ');
    const allWords = [...titleWords, ...hashtags];

    const distances = await Promise.all(inputWords.flatMap(async inputWord =>
        await Promise.all(allWords.map(async (word) =>
            await levenshteinDistance(inputWord.toLowerCase(), word.toLowerCase())
        ))
    ));

    const totalDistance = distances.reduce((sum, distance) => sum + distance, 0);
    return totalDistance / distances.length;
};

const selectSimilarFunctions = async (inputString, searchData) => {
    const dataWithDistances = await Promise.all(searchData.map(async (data) => ({
        data,
        distance: await averageLevenshteinDistance(inputString, data.title, data.hashtags)
    })));

    const sortedData = dataWithDistances.sort((a, b) => a.distance - b.distance);
    const topMatches = sortedData.slice(0, 5);

    return topMatches.map(item => ({
        ...item.data,
        distance: item.distance // Add distance to the choice packet
    }));
};

const searchAutoComplete = async (input) => {
    const selectedFunctions = await selectSimilarFunctions(input, searchData);

    return selectedFunctions.map(choice => {
        const debugInfo = choice.distance ? `(debug: ${choice.distance})` : '';
        return {
            name: `${choice.title} ${debugInfo}`,
            value: choice.title
        };
    });
};

module.exports = { searchAutoComplete };