const { msToHumanReadableTime, convertUnixToTimestamp, waitMs } = require('./../utils/time');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { PermissionFlagsBits } = require("discord.js");
const { Mongo, ENUMS } = require('../models/Mongo');
const config = require('./../../config.json');
const Chart = require('./../models/Chart');
const DC = require('./../singleton/DC');

const MongoDb = new Mongo();

const data = new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Code0 Debug commands.')
    .addStringOption(option =>
        option.setName('action')
            .setDescription('Select a Debug command')
            .setRequired(true)
            .addChoices(
                { name: '[Client] => This session time', value: 'clientSessionTime' },
                { name: '[Mongo] => Check left users', value: 'mongoLeftUsers' },
                { name: '[Mongo] => githubcommits -> new Chart', value: 'githubTotalCommits' }

            ))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)


const debugs = {
    async mongoLeftUsers(interaction, client, guild, member, lang) {
        new Embed()
            .setColor(config.embeds.colors.info)
            .addContext(lang, member, 'mongo-left-users-loading')
            .interactionResponse(interaction);

        const pipeline = [
            {
                $project: {
                    id: 1,
                    _id: 1
                }
            }
        ]

        const userIds = await MongoDb.aggregate(ENUMS.DCB.USERS, pipeline);

        let usersLeft = [];

        for (let i = 0; i < userIds.length; i++) {
            const userPacket = userIds[i];
            const result = await DC.memberById(userPacket.id, guild);
            if (!result) {
                usersLeft.push(userPacket.id);
            }
        }

        new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({
                userstring: (usersLeft.length == 0 ? `${lang.getText("found-none")}` : usersLeft.join("\n")),
                progressbar: progressBar(usersLeft.length, userIds.length) + ` [${usersLeft.length}|${userIds.length}]`
            })
            .addContext(lang, member, 'mongo-left-users')
            .interactionResponse(interaction);
    },

    async clientSessionTime(interaction, client, guild, member, lang) {
        const { d, h, m, s } = msToHumanReadableTime(Date.now() - client.startDate);

        const embed = new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({
                upsince: convertUnixToTimestamp(client.startDate),
                days: d,
                hours: h,
                minutes: m,
                seconds: s
            })
            .addContext(lang, member, 'client-session-time');

        const response = await embed.interactionResponse(interaction);
        if (response == null) return;

        await waitMs(5000);

        this.clientSessionTime(interaction, client, guild, member, lang);
    },

    async githubTotalCommits(interaction, client, guild, member, lang) {
        const getRandomColor = () => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return `rgb(${r},${g},${b})`;
        }

        const getNextDate = (dateString) => {
            const date = new Date(dateString);
            date.setDate(date.getDate() + 1);
            return date.toISOString().slice(0, 10);
        }

        const pipeline = [
            {
                $sort: { time: 1 }
            },
            {
                $group: {
                    _id: {
                        name: "$name",
                        date: {
                            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$time" } }
                        }
                    },
                    dailyCommits: { $sum: "$commitscount" }
                }
            },
            {
                $sort: { "_id.date": 1 }
            }
        ];

        const cursor = await MongoDb.aggregate(ENUMS.DCB.GITHUB_COMMITS, pipeline);
        const dbEntries = await cursor;

        const firstDate = dbEntries[0]._id.date;
        const lastDate = new Date().toISOString().slice(0, 10);

        const cumulativeCommits = {};

        dbEntries.forEach(entry => {
            const { name, date } = entry._id;
            const dailyCommits = entry.dailyCommits;

            if (!cumulativeCommits[name]) {
                cumulativeCommits[name] = [];
            }

            cumulativeCommits[name].push({ date, commits: dailyCommits });
        });

        for (const name in cumulativeCommits) {
            const userData = cumulativeCommits[name];
            const allDates = userData.map(entry => entry.date);

            const filledData = [];
            let currentDate = firstDate;
            let currentIndex = 0;
            let currentCumulative = 0;

            while (currentDate <= lastDate) {
                if (currentIndex < userData.length && allDates[currentIndex] === currentDate) {
                    currentCumulative += userData[currentIndex].commits;
                    filledData.push({ date: currentDate, commits: currentCumulative });
                    currentIndex++;
                } else {
                    filledData.push({ date: currentDate, commits: currentCumulative });
                }

                currentDate = getNextDate(currentDate);
            }

            cumulativeCommits[name] = filledData;
        }

        const labels = Object.values(cumulativeCommits).flatMap(user => user.map(entry => entry.date)).filter((value, index, self) => self.indexOf(value) === index);
        const datasets = [];

        for (const [name, data] of Object.entries(cumulativeCommits)) {
            datasets.push({
                label: name,
                data: data.map(entry => entry.commits),
                borderColor: getRandomColor(),
                fill: false
            });
        }

        const chart = new Chart(1000, 600)
            .setType('line')
            .setLabels(labels);

        datasets.forEach(dataset => {
            chart.addDataset(dataset.label, dataset.data, dataset.borderColor);
        });

        chart.interactionResponse(interaction);
    }
}


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const type = interaction.options.getString('action');

    debugs[type](interaction, client, guild, member, lang);
}


const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
    await DC.defer(interaction);
}

const componentIds = [];

module.exports = { execute, executeComponent, data };