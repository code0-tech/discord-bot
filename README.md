<div align="center">
<h1>Code0 Discord Bot</h1>
</div>

### Basic Overview:

Code0 is a Discord bot developed in JavaScript, utilizing the discord.js client library along with a lightweight web server for GitHub OAuth authentication. This enables certain commands, such as retrieving commit and pull request data.


### Requirements:

- HTTP Port: Required for GitHub OAuth, configured via `http-config.port` in `http-config.json`.

- MongoDB: Used for storing user and bot-related data.
#

## Main Interactions

|     | Command                                      | Status       | Known Bugs
| --- | ---------------------------------------------| ------------ | --------- |
| 1   | `/open-contributer`                          | Finished     |      None |
| 2   | `/ticket`                                    | Finished     |      None |
| 3   | `/links`                                     | In Design    |      None |
| 4   | `/contributor`                               | Finished     |      None |
| 5   | `/rank` or `/rank @user` +uptodate15         | Finished     |      None |
| 6   | `/leaderboard` or `/leaderboard limit: 1-20` | Finished     |      None |
| 7   | `Code0 Application Ticket`                   | Finished     |      None |
| 8   | `/stats` or `/stats @user` + uptodate15      | Finished     |      None |
| 9   | `/logs show` or `/logs list`                 | Finished     |      None |
| 10  | `/debug` for debugging                       | Finished     |      None |
| 11  | `Git rank message every 24 hours`            | Finished     |      None |
| 12  | `/git` display charts of Git activity        | In Progress  |      None |

## Tracking

The bot collects and processes certain statistics, as visible in the source code:

- Message Statistics: Number of messages, words, and characters sent.
- Voice Statistics: Join/leave events, channel switches, and total voice time.

## GitHub OAuth
For /open-contributer, OAuth URLs are not stored. This means authentication is required each time the command is executed.

## Command Tracking

Entrie Example:
```json
{
  "_id": {
    "$oid": "6644f92497346d3e063052fe"
  },
  "id": "380808844093292555",
  "rawxp": 984,
  "stats": {
    "messages": {
      "words": 4002,
      "chars": 20522,
      "count": 676
    },
    "voice": {
      "joins": 116,
      "switchs": 18,
      "time": 98093
    }
  },
  "commandstats": {
    "debug": {
      "command": 15
    },
    "leaderboard": {
      "command": 8
    },
    "stats": {
      "command": 19
    },
    "logs": {
      "command": 10,
      "button": 13
    },
    "logs list": {
      "selectmenu": 5
    },
    "links": {
      "command": 1
    },
    "open-contributor": {
      "command": 2
    },
    "mydata": {
      "command": 3
    },
    "git": {
      "autocomplete": 8,
      "command": 5
    },
    "logs show": {
      "button": 3
    },
    "ticket": {
      "command": 1,
      "button": 3
    },
    "_application": {
      "button": 2
    },
    "rank": {
      "command": 4
    }
  }
}
```

Last MongoDB structure update: 13.02.2025

 Tip: You can mention a Discord user by their ID using `<@user_id>`.

## Missing Files
This repository mirrors the live bot but excludes sensitive or unnecessary files:

- `node_modules/` – Not included (use npm install to generate).
- `server.env / .env` – Contains private configuration and tokens.
- `config.json / http-config.json` – Holds role/channel settings and server configurations.
- `unused-temp.js` – Unused code snippets, kept for reference.
- `a-workon/` – Work-in-progress features.
- `.gitignore` – Specifies ignored files.

💡 If you need a setup template, feel free to contact me on Discord: [DC: nixkuchen].

## Documentation

Currently, no official documentation is available. However, you can explore the bot’s functionality yourself or contact [DC: nixkuchen] for guidance.

## Unused Discord Bot Files

Files located in `./_app/*` are for Discord server setup (e.g., images).

## Versions

The bot is fully functional with the following package versions:
```json
"@discordjs/voice": "^0.18.0"     // [04.01.2025]
"chartjs-node-canvas": "^4.1.6"   // [04.01.2025]
"discord-simpletable": "^1.1.6"   // [08.02.2025]
"discord.js": "^14.17.3"          // [08.02.2025]
"dotenv": "^16.4.7"               // [04.01.2025]
"libsodium-wrappers": "^0.7.15"   // [04.01.2025]
"mongo": "^0.1.0"                 // [04.01.2025]
"node-fetch": "^2.6.12"           // [04.01.2025]
"node-schedule": "^2.1.1"         // [04.01.2025]
"puppeteer": "^23.11.1"           // [04.01.2025]
```

## Commit Naming Conventions

- `wip` – Work in progress.
- `todo` – Task that needs to be completed.
- `readme` – README updates.
- `naming` – Renaming constants, variables, or text.
- `v/version` – Version updates in package.json.

## What does ... mean?

- uptodate15: This means the message will be updated when changes occur up to 15 more minutes after the interaction execution.

## Code Quality & Development Philosophy
Software is always evolving, and Code0 is no exception. Here’s why code may sometimes appear incomplete or unpolished:

1. Rapid Development: The goal is to ensure functionality first.
2. Changing Requirements: Features are frequently adjusted to meet new needs.
3. Ongoing Refinements: Code is continuously improved for efficiency and maintainability.
4. Organized Messiness: While some sections may seem unstructured, they function correctly. Any outstanding issues are documented in TODO (index.js).
5. Fast-Paced Changes: In the early stages, speed often takes priority over perfection.

Since Code0 is actively in development, expect ongoing improvements and changes.
## Nicusch Versioning System (NVS)
- `0.0.1` – Minor bug fixes or small functional improvements.
- `0.1.0` – Command modifications or updates that impact functionality.
- `1.0.0` – Major changes affecting class structures and breaking compatibility.

💡 This system has been in use since 10.07.2024, but earlier commits may not follow it consistently.
## Know issues

- 📱 Mobile UI Bug: Tables and charts do not display correctly on mobile devices (Reported: 01.01.2025).