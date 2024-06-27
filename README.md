<div align="center">
<h1>Code0 Discord Bot</h1>
<h3>Discord bot standalone by Nicusch | Nicolas Morawietz</h3>
</div>

## Code0

### Basic Overview:

This this the Discord Bot for Code0 running in javascript.
#
The Bot is running the Discord.js Client instance and a small Web-Server for Github o-auth in order to perform some commands which includes reading commits and pull's.

For that reason a Http Port is required and currently set to `http-config.port` => 7581

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
| 7   | `Code0 Application Ticket/`                  | Finished     |
| 8   | `/stats` or `/stats @user` + uptodate15      | Finished     |
| 9   | `/search`                                    | WIP          |
| 10  | `/logs show` or `/logs list`                 | Finished     |


<details>
<summary>Included Functions</summary>

1. <span style="color:green;">Auto script command upload</span>
2. <span style="color:green;">Web server for o-auth github</span>
3. <span style="color:green;">Check Languages pack's for missing entries</span>
4. <span style="color:green;">Xp on Interactions with anti spam features</span>

</details>

## Tracking

We do track stats, as you could also tell by our Bot's source code such as:

- Message Stats -> message/word/char count.
- Voice Stats -> joins/leaves/switches.

We use these to determine your rank or display some cool information about you.

For the Command /open-contributer we are not saving your auth url in any way,
which also means that you have to reauth yourself at command execution.

## What is?

- wip: Work in Progess

- uptodate15: This means the message will be updated when changes occur up to 15 more minutes which would mean that the interaction token expires.

- todo: When creating my simple todo's i do a new commit which will be named after "todo".

- readme: Is also a commit whenever i update the readme.