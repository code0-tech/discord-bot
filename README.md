<div align="center">
<h1>Code0 Discord Bot</h1>
<h3>Discord bot standalone by Nicusch | Nicolas Morawietz</h3>
</div>

## Code0

### Basic Overview:

This this the Discord Bot for Code0 running in javascript and mainly developed by Nicolas Morawietz also knows as Nicusch or "nixkuchen" on Discord.
#
The Bot is running the Discord.js Client instance and a small Web-Server for Github o-auth in order to perform some commands which includes reading commits and pull's.

For that reason a Http Port is required and currently set to `http-config.port` => 7581

Also a MongoDb is required as this Bot needs some DataBase to store Data
#


|     | Command                                       | Status       |
| --- | --------------------------------------------- | ------------ |
| 1   | `/open-contributer`                          | Finished     |
| 2   | `/ticket`                                    | Finished     |
| 3   | `/links`                                     | In Progress  |
| 4   | `/contributor`                               | In Progress  |
| 5   | `/rank + get xp by messages depending on length` | Testing[1/4]  |
| 6   | `Code0 Application Ticket/`                  | In Progress  |
| 7   | `quizz for fun`                              | Idea         |
| 8   | `other games or funny things`                | Idea         |
| 9   | `/leaderboard` to see global stats of user   | Idea for /rank|
| 10   | a way to make my entry in leaderboard anonymous| Idea for /leaderboard|

<details>
<summary>Included Functions</summary>

1. <span style="color:green;">Auto script command upload</span>
2. <span style="color:green;">Web server for o-auth github</span>
3. <span style="color:green;">Check Languages pack's for missing entries</span>

</details>

### Discord Bot Config:

<details>
<summary>Roles</summary>

1. `opencontributor`

</details>

<details>
<summary>Language Roles</summary>

1. Currently supported are <span style="color:green;">`german`</span> and <span style="color:green;">`english`</span>.

</details>

<details>
<summary>Channels</summary>

1. `debug`
2. `auditlog`
3. `welcome`
4. `contributorapplications`

</details>

<details>
<summary>Parents [Channels]</summary>

1. `support`

</details>

<details>
<summary>Embeds</summary>

### Simple Embed configuration

```json
{
    "embeds": {
        "colors": {
            "background": "#030014",
            "primary": "#030014",
            "secondary": "#ffffff",
            "info": "#70ffb2",
            "success": "#29BF12",
            "warning": "#FFBE0B",
            "inprogress": "#FFBE0B",
            "danger": "#D90429",
            "black": "#000000",
            "white": "#ffffff"
        },
        "footer": {
            "default": "Code0"
        },
        "avatarurl": "CODE0_AVATAR_URL",
        "progressbar": {
            "pbl0": "<:pbl0:1233913435956187197>",
            "pbl1": "<:pbl1:1233913511122309281>",
            "pbm0": "<:pbm0:1233913574888443954>",
            "pbm1": "<:pbm1:1233913626369331282>",
            "pbr0": "<:pbr0:1233913673421160548>",
            "pbr1": "<:pbr1:1233913721789874176>"
        }
    },
```

</details>