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
#


<details>
<summary>Discord Interactions</summary>

1. Command: <span style="color:green;">`/open-contributer` [finished]</span>
2. Command: <span style="color:green;">`/ticket` [finished]</span>
3. Command: <span style="color:red;">`/links` [in progress]</span>
4. Command: <span style="color:red;">`/contributor` [in progress]</span>
5. Interaction: <span style="color:red;">`Code0 Application Ticket/` [in progress]</span>
6. Idea: <span style="color:yellow;">`quizz for fun` [idea]</span>
7. Fany things: <span style="color:yellow;">`other games or funny things` [idea]</span>

</details>

<details>
<summary>Included Functions</summary>

1. <span style="color:green;">Auto script command upload</span>
2. <span style="color:green;">Web server for o-auth github</span>

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