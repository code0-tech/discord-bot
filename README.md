<div align="center">
<h1>Code0 Discord Bot</h1>
</div>

### Basic Overview:

This this the Discord Bot for Code0 running in javascript.
#
The Bot is running the Discord.js Client instance and a small Web-Server for Github o-auth in order to perform some commands which includes reading commits and pull's.

For that reason a Http Port is required and currently set via `http-config.port` inside the http-config.json

A MongoDb is required as this Bot stores some Data
#

## Main Interactions

|     | Command                                      | Status       | Known Bugs
| --- | ---------------------------------------------| ------------ | --------- |
| 1   | `/open-contributer`                          | Finished     |         0 |
| 2   | `/ticket`                                    | Finished     |         0 |
| 3   | `/links`                                     | Design       |         0 |
| 4   | `/contributor`                               | Finished     |         0 |
| 5   | `/rank` or `/rank @user` +uptodate15         | Finished     |         0 |
| 6   | `/leaderboard` or `/leaderboard limit: 1-20` | Finished     |         0 |
| 7   | `Code0 Application Ticket`                   | Finished     |         0 |
| 8   | `/stats` or `/stats @user` + uptodate15      | Finished     |         0 |
| 9   | `/logs show` or `/logs list`                 | Finished     |         0 |
| 10  | `/debug` for debugging                       | Finished     |         0 |
| 11  | `Git rank message every 24 hours`            | Finished     |         0 |
| 12  | `/git` display charts of Git activity        | WIP          |         0 |

## Tracking

We do track stats, as you could tell by our Bot's source code such as:

- Message Stats -> message|word|char
- Voice Stats -> joins|leaves|switches|time

We use these to determine your rank or display stats about you.

For the Command /open-contributer we are not saving your o-auth url for github in any way,
which also means that you have to re-auth yourself at any command execution.

Command tracking is not implemented (yet).
We are currently not saving any executed commands

Entrie Example:
```json
{
    "_id": {
        "$oid": "6644f92497346d3e063052fe" // MongoDb unique id
    },
    "id": "380808844093292555", // user id, no name
    "rawxp": 812, // Your rawXp
    "stats": {
        "messages": {
            "words": 3896, // Total word count
            "chars": 19915, // Total char count
            "count": 650 // Total message count
        },
        "voice": {
            "joins": 113, // Voice channel joins
            "switchs": 17, // Voice channel changes like from Talk#1 to Talk#2 (while remaining connection)
            "time": 88848 // Voice time in seconds
        }
    },
    "commandstats": {} // empty unused
}
```

MongoDb entries last structure update for ReadMe: 08.02.2025

Ps: On Discord you can do <@user_id> to find out the name of a discord by his user id.

## Were are the missing files?

The code you see here mirrors what's running on the Discord Bot server. However, some files are not open-source:

- node_modules: Not included here because storing them wouldn't be practical.
- server.env: Server-side configuration. [Stored tokens etc]
- .env: Development configuration. [Stored tokens etc]
- config.json: Contains server-specific settings like roles, channels, embeds, etc.
- http-config.json: Specifically used for our server.
- unused-temp.js: Stores unused code snippets for potential future use.
- a-workon: Is a folder with files which are still wip and not able to be used now.
- .gitignore: A mysterious file that even hides from itself.

If you'd like to set up this bot for testing purposes, please contact me at [DC:nixkuchen]. I can provide you with a template to get started.

## Unused files for the Discord Bot process

In `./_app/*` are files that are just to setup the Discord server, like images

## Versions

    "@discordjs/voice": "^0.18.0",     [04.01.2025]
    "chartjs-node-canvas": "^4.1.6",   [04.01.2025]
    "discord-simpletable": "^1.1.6",   [08.02.2025]
    "discord.js": "^14.17.3",          [08.02.2025]
    "dotenv": "^16.4.7",               [04.01.2025]
    "libsodium-wrappers": "^0.7.15",   [04.01.2025]
    "mongo": "^0.1.0",                 [04.01.2025]
    "node-fetch": "^2.6.12",           [04.01.2025]
    "node-schedule": "^2.1.1",         [04.01.2025]
    "puppeteer": "^23.11.1"            [04.01.2025]

The Code works 100% with these versions.

## What does this commit mean?

- wip: Work in Progess

- todo: When creating my todos i will create a new commit which will be named after "todo".

- readme: Is also a commit whenever i update the readme.

- naming: Simple changes of const, vars or text.

- v/version: version update in package.json

## What does ... mean?

- uptodate15: This means the message will be updated when changes occur up to 15 more minutes after the interaction execution.

## Why Does Code Sometimes Fall Short?

- Reason 1: Code is often hastily written just to achieve functionality.

- Reason 2: Requirements frequently change, necessitating frequent code revisions.

- Reason 3: Code undergoes continuous style and functional evolution in Code0.

- Reason 4: While the current state might seem messy, it functions without known bugs; any issues are documented in TODO => index.js.

- Reason 5: Rapid development can lead to shortcuts, resulting in functional but sometimes suboptimal code.

Since this bot is under development, significant changes may occur.

## Nicusch Version System

0.0.1 => Bug fixes or small changes | Updates of functions while keeping the same functionality

0.1.0 => Command changes | Updates that break small functions

1.0.0 => Changes of entire Class or Interaction method structures which will break other stuff

Very simple to keep track of, this NVS was not used correctly until now 10.07.2024.

## Know issues

- 1: Tables and Bars are not displayed correctly on Mobile devices [01.01.2025]