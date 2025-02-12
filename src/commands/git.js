const { SlashCommandBuilder } = require('@discordjs/builders');
const { GIT, GIT_SETTINGS } = require('./../singleton/GIT');
const DiscordSimpleTable = require('discord-simpletable');
const { convertDDMMYYToUnix } = require('../utils/time');
const { Embed, COLOR } = require('./../models/Embed');
const Constants = require('../../data/constants');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('git')
    .setDescription('Display Git activity.')
    .setDescriptionLocalizations({
        de: 'Git aktivität für Code0.',
    })
    .addSubcommand(subcommand =>
        subcommand.setName('table')
            .setDescription('Display Git activity as a table.')
            .addStringOption(option =>
                option.setName('users')
                    .setDescription('Select multiple Git users (comma-separated)')
                    .setAutocomplete(true)
                    .setRequired(false)
            )
            .addStringOption(option =>
                option.setName('repos')
                    .setDescription('Select multiple Git repos (comma-separated)')
                    .setAutocomplete(true)
                    .setRequired(false)
            )
            .addStringOption(option =>
                option.setName('time-start')
                    .setDescription('Set start time')
                    .setAutocomplete(true)
                    .setRequired(false)
            )
            .addStringOption(option =>
                option.setName('time-end')
                    .setDescription('Set start time')
                    .setAutocomplete(true)
                    .setRequired(false)
            )
    )

const sendChart = async (description, attachment) => {
    return new Embed()
        .setColor(COLOR.INFO)
        .setDescription(description)
        .setAttachment(attachment)
        .setFooter(`Stats over the last ${await totalDays()} days.`)
        .setImage(Constants.DISCORD.EMBED_IMAGE_NAME.EMBED.DEFAULT_PNG_01);
}

const getFilters = async (interaction) => {
    let usersArray = (interaction.options.getString('users')?.split(',').map(user => user.trim()).filter(Boolean) || await GIT.getAllUniqueNames());
    let reposArray = (interaction.options.getString('repos')?.split(',').map(repo => repo.trim()).filter(Boolean) || await GIT.getAllRepos());
    let timeStart = interaction.options.getString('time-start')?.split(".").join("-") || (await GIT.timeStartAndEnd()).startDate;
    let timeEnd = interaction.options.getString('time-end')?.split(".").join("-") || (await GIT.timeStartAndEnd()).endDate;

    return { usersArray, reposArray, timeStart, timeEnd };
}

const commands = {
    async table(interaction, client, guild, member, lang) {
        const { usersArray, reposArray, timeStart, timeEnd } = await getFilters(interaction);

        const settings = [
            GIT_SETTINGS.USERS(usersArray),
            GIT_SETTINGS.REPONAMES(reposArray),
            GIT_SETTINGS.SET_START(convertDDMMYYToUnix(timeStart, false)),
            GIT_SETTINGS.SET_END(convertDDMMYYToUnix(timeEnd, true)),
            GIT_SETTINGS.DAILY_PACKETS()
        ]

        const gitData = await GIT.simpleSort(settings);

        console.dir(gitData);
        console.dir(settings);

        new Embed()
            .setTitle('Command in Progress, will be finished soon')
            .setColor(COLOR.IN_PROGRESS)
            .interactionResponse(interaction)
    }
}

const autoCompleteUsers = async (focusedValue) => {
    const usersList = await GIT.getAllUniqueNames();

    const splitValues = focusedValue.split(',').map(val => val.trim());
    const lastInput = splitValues.pop();
    const existingUsers = splitValues.join(', ');

    const filteredUsers = usersList.filter(user =>
        user.toLowerCase().startsWith(lastInput.toLowerCase()) &&
        !splitValues.includes(user)
    );

    return filteredUsers.slice(0, 25).map(user => {
        const newValue = existingUsers ? `${existingUsers}, ${user}` : user;
        return { name: newValue, value: newValue };
    });
}

const autoCompleteRepositories = async (focusedValue) => {
    const repoList = await GIT.getAllRepos();

    const splitValues = focusedValue.split(',').map(val => val.trim());
    const lastInput = splitValues.pop();
    const existingRepos = splitValues.join(', ');

    const filteredRepos = repoList.filter(repo =>
        repo.toLowerCase().startsWith(lastInput.toLowerCase()) &&
        !splitValues.includes(repo)
    );

    return filteredRepos.slice(0, 25).map(repo => {
        const newValue = existingRepos ? `${existingRepos}, ${repo}` : repo;
        return { name: newValue, value: newValue };
    });
};

const autoCompleteDates = async (focusedValue) => {
    const { startDate, endDate } = await GIT.timeStartAndEnd();

    if (focusedValue == '') {
        return [];
    }

    if (!startDate || !endDate) {
        return [];
    }

    if (!focusedValue.endsWith('.') && focusedValue.length < 3) {
        focusedValue += '.';
    }

    const start = new Date(startDate.split('-').reverse().join('-'));
    const end = new Date(endDate.split('-').reverse().join('-'));

    const [day, month, year] = focusedValue.split('.').map(Number);

    const suggestions = [];

    for (let yearIter = start.getFullYear(); yearIter <= end.getFullYear(); yearIter++) {
        const potentialDate = new Date(yearIter, month - 1, day);

        if (potentialDate >= start && potentialDate <= end) {
            suggestions.push(potentialDate.toLocaleDateString(Constants.LOCALES.DATE.LOCAL_STRING.GERMAN));
        }
    }

    const result = suggestions.slice(0, 20).map(date => ({ name: date, value: date }));
    return result;
}

const autoComplete = async (interaction, client, guild, member, lang) => {
    const optionName = interaction.options.getFocused(true).name;
    const focusedValue = interaction.options.getFocused();

    let choices = [];
    if (optionName === 'users') {
        choices = await autoCompleteUsers(focusedValue);
    } else if (optionName === 'repos') {
        choices = await autoCompleteRepositories(focusedValue);
    } else if (optionName === 'time-start' || optionName === 'time-end') {
        choices = await autoCompleteDates(focusedValue);
    }

    await interaction.respond(choices);
}

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const subCommand = interaction.options.getSubcommand();

    if (commands[subCommand]) {
        commands[subCommand](interaction, client, guild, member, lang);
    }
}


module.exports = { execute, autoComplete, data };