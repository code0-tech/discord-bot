const { searchData } = require('./search');

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

    const topMatches = findTopMatches(search, search == 'all' ? 1000 : 5).map((data) => {
        return {
            "name": data.title + (global.isDevelopment ? ` (debug: ${data.similarity})` : ''),
            "value": data.title
        };
    })

    return topMatches;
};


module.exports = { searchAutoComplete };