const config = require('./../../config.json');

const searchData = [
    {
        "title": "Unlock the Power of our Discord Bot Commands",
        "hashtags": [
            "commands",
            "discord bot",
            "discord",
            "bot commands",
            "command list",
            "discord server"
        ],
        "description": "Discover a multitude of commands to enhance your Discord experience and maximize the potential of our bot."
    },
    {
        "title": "Explore Xp: Level Up Your Interactions",
        "hashtags": [
            "xp",
            "interactions",
            "rank",
            "stats",
            "experience",
            "leveling up"
        ],
        "description": "Dive into our straightforward XP system, where community engagement leads to leveling up. Learn about your rank with `/rank`, delve into the true value of your interactions, ensuring an accurate reflection of your contributions, and compete for the top spot on the leaderboard with `/leaderboard`."
    },
    {
        "title": "Code0's Vibrant Discord Community",
        "hashtags": [
            "discord",
            "community",
            "code0",
            "member",
            "community support",
            "discord group"
        ],
        "description": "Become part of our lively Discord community to find support, discover relevant content, and connect with like-minded members passionate about Code0. Engage in discussions, seek assistance, and enjoy a welcoming community dedicated to all things Code0."
    },
    {
        "title": "Elevate Your Involvement: Join our Closed Team",
        "hashtags": [
            "team",
            "closed",
            "application",
            "apply",
            "team membership",
            "exclusive access"
        ],
        "description": "Ready to take your involvement to the next level? Begin as an open contributor through `/open-contributor`, then link your GitHub account to unlock access. Once you've earned the role, head over to the <#" + config.channels.application + "> channel and submit your application to join our exclusive closed team."
    },
    {
        "title": "Stay Updated with our Git Channel",
        "hashtags": [
            "git",
            "channel",
            "discord",
            "github",
            "version control",
            "repository"
        ],
        "description": "Our Git Channel serves as a log for GitHub activities."
    },
    {
        "title": "Discover Discord Commands with Ease",
        "hashtags": [
            "bot",
            "commands",
            "discord",
            "bot interaction",
            "command usage",
            "discord bot guide"
        ],
        "description": "No need for a list! Just use `/` followed by the command. A description will pop-up showing you all you need to know."
    },
    {
        "title": "Experience Multilingual Support",
        "hashtags": [
            "lang",
            "english",
            "german",
            "spanish",
            "multilanguage",
            "multiculti",
            "language support",
            "multilingual",
            "language roles"
        ],
        "description": "Enjoy support for " + Object.entries(config.languageroles).length + " languages:\n" + Object.entries(config.languageroles).map(([key, language]) => `- ${language}.`).join('\n') + "\nSometimes `/` commands or other messages are not translated into other languages like German; in those cases, messages will be displayed in English. Also, if you have multiple language roles, we default to English."
    },
    {
        "title": "Is /search Google?",
        "hashtags": [
            "google",
            "search",
            "searching",
            "what is this",
            "search engine",
            "online search"
        ],
        "description": "The simple answer is `no`, this is not like [Google](https://www.google.com) but rather a small search for our Discord server."
    },
    {
        "title": "Can you make me a Cake?",
        "hashtags": [
            "Cake",
            "go",
            "do",
            "create",
            "cakemaster",
            "execute"
        ],
        "description": "Sorry i cant make Cakes, since i never ... did ... them?... well idk really ."
    },
    {
        "title": "Large Language Models",
        "hashtags": [
            "language model",
            "AI",
            "GPT",
            "NLP",
            "artificial intelligence",
            "natural language processing"
        ],
        "description": "ChatGpt, LLama3, ... these AI-powered systems are at the forefront of natural language processing (NLP) technology. They have been trained on vast amounts of text data to understand and generate human-like text. From answering questions to generating creative content, large language models are revolutionizing how we interact with and utilize language in various applications."
    }
];


const example = [
    {
        title: "EXAMPLE",
        hastags: [],
        description: "EXAMPLE"
    }
]

module.exports = { searchData };