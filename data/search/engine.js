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

/* const averageLevenshteinDistance = async (inputString, title, hashtags) => {
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
}; */

const searchAutoComplete = async (input) => {
    // const selectedFunctions = await selectSimilarFunctions(input, searchData);

    /*  const search = 'What is this';
 
     const searchWords = search.split(" ");
 
 
     console.log(await levenshteinDistance('hi', 'test'))
     console.log(await levenshteinDistance('tes', 'test'))
     console.log(await levenshteinDistance('test', 'test'))
  */

    /* return selectedFunctions.map(choice => {
        const debugInfo = choice.distance ? `(debug: ${choice.distance})` : '';
        return {
            name: `${choice.title} ${debugInfo}`,
            value: choice.title
        };
    }); */
    const inputString = "Find a GitHub channel";
    const jsonArray = [
        {
            "title": "Git Channel",
            "hashtags": [
                "git",
                "channel",
                "discord",
                "github"
            ],
            "description": "The Git Channel serves as a GitHub log channel."
        },
        {
            "title": "Cooking Recipes",
            "hashtags": [
                "cooking",
                "recipes",
                "food",
                "kitchen"
            ],
            "description": "A channel dedicated to cooking recipes and kitchen tips."
        },
        {
            "title": "Travel Guides",
            "hashtags": [
                "travel",
                "guides",
                "adventure",
                "exploration"
            ],
            "description": "Explore new travel destinations and adventure guides."
        },
        {
            "title": "Tech News",
            "hashtags": [
                "technology",
                "news",
                "updates",
                "gadgets"
            ],
            "description": "Latest technology news and updates."
        },
        {
            "title": "Programming Tutorials",
            "hashtags": [
                "programming",
                "tutorials",
                "coding",
                "development"
            ],
            "description": "Tutorials and resources for learning programming."
        },
        {
            "title": "Gaming Channel",
            "hashtags": [
                "gaming",
                "games",
                "video",
                "streaming"
            ],
            "description": "Channel for gaming videos and live streams."
        },
        {
            "title": "Fitness Tips",
            "hashtags": [
                "fitness",
                "workout",
                "health",
                "exercise"
            ],
            "description": "Tips and advice for staying fit and healthy."
        },
        {
            "title": "Movie Reviews",
            "hashtags": [
                "movies",
                "reviews",
                "films",
                "cinema"
            ],
            "description": "Latest reviews of movies and films."
        },
        {
            "title": "Music Channel",
            "hashtags": [
                "music",
                "songs",
                "albums",
                "artists"
            ],
            "description": "Channel for music videos and song recommendations."
        },
        {
            "title": "Photography Tips",
            "hashtags": [
                "photography",
                "camera",
                "photos",
                "tips"
            ],
            "description": "Advice and tips for photographers."
        }
    ];

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

    // Combine title and hashtags into a single string for each entry
    const combinedDocuments = jsonArray.map(entry => `${entry.title} ${entry.hashtags.join(' ')}`);

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
    const top5Matches = similarities.slice(0, 5).map(match => jsonArray[match.index]);

    console.log('Top 5 Matching Objects:');
    top5Matches.forEach((match, i) => {
        console.log(`${i + 1}: ${JSON.stringify(match, null, 2)}`);
    });

};

searchAutoComplete('n');

module.exports = { searchAutoComplete };

/* 
const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "A fast brown fox leaps over a lazy dog.",
        "A completely different sentence.",
        "The lazy dog was jumped over by a quick brown fox.",
        "Foxes are quick and brown and they jump over lazy dogs.",
        "Another sentence entirely different from the others.",
        "This sentence is somewhat similar to the first one.",
        "A lazy dog is jumped over by a fast, brown fox.",
        "The brown fox is quick and jumps over the lazy dog.",
        "Completely unrelated sentence just for the test."
    ];
    
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
    function inverseDocumentFrequency(sentences) {
        const idf = {};
        const totalDocuments = sentences.length;
        const tokenSets = sentences.map(sentence => new Set(tokenize(sentence)));
    
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
    
    // Function to compute the TF-IDF vector for a sentence
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
    
    // Tokenize sentences and compute IDF
    const tokenizedSentences = sentences.map(tokenize);
    const idf = inverseDocumentFrequency(sentences);
    
    // Compute TF-IDF vectors for each sentence
    const tfIdfVectors = tokenizedSentences.map(tokens => tfIdfVector(tokens, idf));
    
    // Compute the similarity scores and find the top 5 matches for each sentence
    const topMatches = [];
    
    for (let i = 0; i < tfIdfVectors.length; i++) {
        const similarities = [];
        for (let j = 0; j < tfIdfVectors.length; j++) {
            if (i !== j) {
                const similarity = cosineSimilarity(tfIdfVectors[i], tfIdfVectors[j]);
                similarities.push({ index: j, similarity });
            }
        }
        similarities.sort((a, b) => b.similarity - a.similarity);
        topMatches.push(similarities.slice(0, 5));
    }
    
    // Print the top 5 matching sentences for each sentence
    for (let i = 0; i < topMatches.length; i++) {
        console.log(`Top 5 matches for sentence ${i + 1}: "${sentences[i]}"`);
        topMatches[i].forEach(match => {
            console.log(` - Match ${match.index + 1}: "${sentences[match.index]}" with similarity ${match.similarity.toFixed(4)}`);
        });
        console.log();
    }
*/