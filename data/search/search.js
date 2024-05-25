// "edit on changes" are marked stuff to be changes when they change lol

const config = require('./../../config.json');

const searchData = [
    {
        "title": "Discord Bot Commands",
        "hashtags": [
            "commands",
            "discord bot",
            "discord"
        ],
        "description": "Explore a variety of commands to engage with our Discord bot and unlock its full potential."
    },
    {
        "title": "Info about Xp",
        "hashtags": [
            "xp",
            "interactions",
            "rank",
            "stats"
        ],
        "description": "Discover our simple XP system, where leveling up occurs as you engage with the community. Explore your rank with `/rank`, uncover the real value behind your interactions, ensuring a more accurate representation of your contributions, and compete for the top spot on the leaderboard with `/leaderboard`."
    },
    {
        "title": "Code0 Discord",
        "hashtags": [
            "discord",
            "community",
            "code0",
            "member"
        ],
        "description": "Join our vibrant Discord community to find support, discover relevant content, and connect with fellow members interested in Code0. Engage in discussions, seek assistance, and be part of a welcoming community dedicated to all things Code0."
    },
    {
        "title": "Be a part of our Closed Team",
        "hashtags": [
            "team",
            "closed",
            "application",
            "apply"
        ],
        "description": "Ready to take your involvement to the next level? Start by becoming an open contributor through `/open-contributor`, then link your GitHub account to unlock access. Once you've earned the role, head over to the <#" + config.channels.application + "> channel and submit your application to join our exclusive closed team."
    },
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
        "title": "Discord Command List?",
        "hashtags": [
            "bot",
            "commands",
            "discord"
        ],
        "description": "Well we got no list but just use `/` and the command will pop up just like you executed this command."
    },
    { // edit on changes
        "title": "Languages",
        "hashtags": [
            "lang",
            "english",
            "german",
            "spanish",
            "multilanguage",
            "multiculti"
        ],
        "description": "Currently we got two languages supported.\n\n- English\n- German.\n\nSomtimes `/`-commands or other messages are not translated to other languages than German, this messages will be in English. Also if you have multiple language roles we try to use English instead."
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