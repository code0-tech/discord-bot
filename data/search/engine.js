const config = require('./../../config.json');
const { searchData } = require('./search');

// Get all words form Search and hashtags into one array
const allWords = searchData.flatMap(item => [...item.title.split(' '), ...item.hashtags.flatMap(tag => tag.split(' '))]);

// Function to tokenize a sentence into words
function tokenize(sentence) {
    return sentence.toLowerCase().match(/\b(\w+)\b/g);
}

// Function to compute the term frequency (TF)
function termFrequency(tokens) {
    const tf = {};
    tokens.forEach(token => {
        if (!tf[token]) {
            tf[token] = 0;
        }
        tf[token]++;
    });
    return tf;
}

// Function to compute the inverse document frequency (IDF)
function inverseDocumentFrequency(documents) {
    const idf = {};
    const totalDocuments = documents.length;
    const tokenSets = documents.map(doc => new Set(tokenize(doc)));

    tokenSets.forEach(tokenSet => {
        tokenSet.forEach(token => {
            if (!idf[token]) {
                idf[token] = 0;
            }
            idf[token]++;
        });
    });

    for (const token in idf) {
        idf[token] = Math.log(totalDocuments / idf[token]);
    }
    return idf;
}

// Function to compute the TF-IDF vector for a document
function tfIdfVector(tokens, idf) {
    const tf = termFrequency(tokens);
    const tfIdf = {};

    tokens.forEach(token => {
        tfIdf[token] = (tf[token] || 0) * (idf[token] || 0);
    });
    return tfIdf;
}

// Function to compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
    const intersection = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    const dotProduct = Array.from(intersection).reduce((sum, key) => {
        return sum + (vecA[key] || 0) * (vecB[key] || 0);
    }, 0);

    const magnitudeA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

function levenshteinDistance(s1, s2) {
    if (s1 === s2) {
        return 0;
    }
    if (s1.length === 0) {
        return s2.length;
    }
    if (s2.length === 0) {
        return s1.length;
    }

    const m = s1.length;
    const n = s2.length;
    const cost = s1[m - 1] === s2[n - 1] ? 0 : 1;
    return Math.min(
        levenshteinDistance(s1.slice(0, -1), s2) + 1,
        levenshteinDistance(s1, s2.slice(0, -1)) + 1,
        levenshteinDistance(s1.slice(0, -1), s2.slice(0, -1)) + cost
    );
}

function selectSimilarFunction(inputString) {
    let minDistance = Number.POSITIVE_INFINITY;
    let similarFunction = null;
    for (const func of allWords) {
        const distance = levenshteinDistance(inputString, func);
        if (distance < minDistance) {
            minDistance = distance;
            similarFunction = func;
        }
    }

    return similarFunction;
}

function findTopMatches(inputString, maxMatches = 5) {


    // Combine title and hashtags into a single string for each entry
    const combinedDocuments = searchData.map(entry => `${entry.title} ${entry.hashtags.join(' ')}`);

    // Tokenize combined documents and compute IDF
    const tokenizedDocuments = combinedDocuments.map(tokenize);
    const idf = inverseDocumentFrequency(combinedDocuments);

    // Compute TF-IDF vectors for each document
    const tfIdfVectors = tokenizedDocuments.map(tokens => tfIdfVector(tokens, idf));

    // Tokenize the input string and compute its TF-IDF vector
    const inputTokens = tokenize(inputString);
    const inputTfIdfVector = tfIdfVector(inputTokens, idf);

    // Compute the similarity scores between the input string and each document
    const similarities = tfIdfVectors.map((tfIdfVector, index) => ({
        index,
        similarity: cosineSimilarity(inputTfIdfVector, tfIdfVector)
    }));

    // Sort by similarity score in descending order and get the top 5 matches
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Filter out matches with similarity score of 0
    // const filteredSimilarities = similarities.filter(match => match.similarity > 0); // dont use this, its better for UX

    const topMatches = similarities.slice(0, maxMatches).map(match => ({
        ...searchData[match.index],
        similarity: match.similarity
    }));

    return topMatches;
}


const searchAutoComplete = async (search) => {

    // when the search is all show all (simple way to get an full overview of all faq's)
    if (search == 'all') {
        return searchData.map((data) => {
            return {
                "name": data.title,
                "value": data.title
            };
        })
    }

    // Take the Search input and create an array of the words
    const words = search.split(" ");

    // Take the words and create new words using levenshteinDistance to the words inside the /searchdata
    const correctedWords = words.flatMap(word => selectSimilarFunction(word));

    // Create a new Search String using the corrected words
    const newSearch = correctedWords.join(" ");

    // Use some really tricky math to get a result / get the 5 best results
    const topMatches = findTopMatches(newSearch, config.commands.search.maxresults).map((data) => {
        return {
            "name": data.title + (global.isDevelopment ? ` (debug: ${data.similarity})` : ''),
            "value": data.title
        };
    })

    return topMatches;
};


// searchAutoComplete('Teaml memler')


module.exports = { searchAutoComplete };