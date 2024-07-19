<div align="center">
<h1>Code0 Discord Bot</h1>
<h3>Discord bot standalone by Nicusch | Nicolas Morawietz</h3>
</div>

## Code0

### Basic Overview:

This this the Discord Bot for Code0 running in javascript.
#
The Bot is running the Discord.js Client instance and a small Web-Server for Github o-auth in order to perform some commands which includes reading commits and pull's.

For that reason a Http Port is required and currently set to `http-config.port`

Also a MongoDb is required as this Bot needs some DataBase to store Data
#

## Main Interactions

|     | Command                                      | Status       |
| --- | ---------------------------------------------| ------------ |
| 1   | `/open-contributer`                          | Finished     |
| 2   | `/ticket`                                    | Finished     |
| 3   | `/links`                                     | Design       |
| 4   | `/contributor`                               | Finished     |
| 5   | `/rank` or `/rank @user` +uptodate15         | Finished     |
| 6   | `/leaderboard` or `/leaderboard limit: 1-20` | Finished     |
| 7   | `Code0 Application Ticket`                   | Finished     |
| 8   | `/stats` or `/stats @user` + uptodate15      | Finished     |
| 9   | `/logs show` or `/logs list`                 | Finished     |
| 10  | `/debug` for debugging                       | Debug (WIP)  |
| 11  | `Git rank message every 24 hours`            | Finished     |


## Tracking

We do track stats, as you could tell by our Bot's source code such as:

- Message Stats -> message/word/char *count.
- Voice Stats -> joins/leaves/switches *count.

We use these to determine your rank or display stats about you.

For the Command /open-contributer we are not saving your o-auth url for github in any way,
which also means that you have to re-auth yourself at any command execution.

Command tracking is not implemented (yet).
We are currently not saving any executed commands

The entries look like this:

    {
      "_id": {  
        "$oid": "19cc07cc20024a04cc01cc2024" // _id given by Mongo
      },
    "id": "380808844093292555", // user id, no name
     "rawxp": 631, // your rawXp, the xp of 380808844093292555 have been altered for tests
      "stats": {
        "messages": {
         "words": 3739, // word count
         "chars": 18850, // char count
         "count": 617 // message total count
       },
       "voice": {
         "joins": 100, // voice channel joins
        "switchs": 14, // voice switchts aka channel changes while beeing connected
         "time": 47968 // total time in seconds
       }
      },
     "commandstats": {} // empty unused
    }

MongoDb entries last updated in ReadMe: 19.07.2024

## Were are the missing files?

The code you see here mirrors what's running on the Discord Bot server. However, some files are not open-source:

- node_modules: Not included here because storing them wouldn't be practical.
- server.env: Server-side configuration.
- .env: Development configuration.
- config.json: Contains server-specific settings like roles, channels, embeds, etc.
- http-config.json: Specifically used for our server.
- unused-temp.js: Stores unused code snippets for potential future use.
- a-workon: Is a folder with files which are still wip and not able to be used now.
- .gitignore: A mysterious file that even hides from itself.

If you'd like to set up this bot for testing purposes, please contact me at [DC:nixkuchen]. I can provide you with a template to get started.

## Unused files for the Discord Bot process

In `./data/_app/*` are files that are just to setup the Discord server

## Versions

    "@discordjs/voice": "^0.17.0",
    "canvas": "^2.11.2",
    "chartjs-node-canvas": "^4.1.6",
    "discord.js": "^14.15.3",
    "dotenv": "^16.3.1",
    "html-to-image": "^1.11.11",
    "html2canvas": "^1.4.1",
    "libsodium-wrappers": "^0.7.13",
    "mongo": "^0.1.0",
    "node-fetch": "^2.6.12",
    "puppeteer": "^22.10.0",
    "ytdl-core": "^4.11.5"


The Code works 100% with these versions.

## What is?

- wip: Work in Progess

- uptodate15: This means the message will be updated when changes occur up to 15 more minutes which would mean that the interaction token expires.

- todo: When creating my simple todo's i do a new commit which will be named after "todo".

- readme: Is also a commit whenever i update the readme.

## Why Does Code Sometimes Fall Short?

- Reason 1: Code is often hastily written just to achieve functionality.

- Reason 2: Requirements frequently change, necessitating frequent code revisions.

- Reason 3: Code undergoes continuous style and functional evolution in Code0.

- Reason 4: While the current state might seem messy, it functions without known bugs; any issues are documented in TODO => index.js.

- Reason 5: Rapid development can lead to shortcuts, resulting in functional but sometimes suboptimal code.

Since this bot is under development, significant changes may occur.

## Nicusch Version System

0.0.1 => Bug fixes or small changes

0.1.0 => Command changes

0.0.0 => Changes of entire Class or Interaction method structures

Very simple to keep track of, this NVS was not used correctly until now 10.07.2024.

## Know issues

- 1: Tables and Bars are not displayed correctly on Mobile devices