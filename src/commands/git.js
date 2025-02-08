const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordSimpleTable = require('discord-simpletable');
const { Mongo, ENUMS } = require('../models/Mongo');
const Constants = require('../../data/constants');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('git')
    .setDescription('Display Git activity.')
    .setDescriptionLocalizations({
        de: 'Git aktivität für Code0.',
    })
    /* .addSubcommand(subcommand => subcommand
        .setName('repopie')
        .setDescription('Display Git repo activity as an pie chart.')
        .setDescriptionLocalizations({
            de: 'Zeigt Git aktivität für alle Repos als Kuchen-diagram.',
        })
    ) */
    .addSubcommand(subcommand => subcommand
        .setName('repograph')
        .setDescription('Display Git repo activity as an graph chart.')
        .setDescriptionLocalizations({
            de: 'Zeigt Git aktivität für alle Repos als Graph.',
        })
    )
    .addSubcommand(subcommand => subcommand
        .setName('repotable')
        .setDescription('Display Git repo activity as an table.')
        .setDescriptionLocalizations({
            de: 'Zeigt Git aktivität für alle Repos als Tabelle.',
        })
    )

const sendChart = async (description, attachment) => {
    return new Embed()
        .setColor(config.embeds.colors.info)
        .setDescription(description)
        .setAttachment(attachment)
        .setFooter(`Stats over the last ${await totalDays()} days.`)
        .setImage(Constants.DISCORD.EMBED_IMAGE_NAME.EMBED.DEFAULT_PNG_01);
}

const commands = {
    async repoPie(interaction, client, guild, member, lang) {

    },
    async repoGraph(interaction, client, guild, member, lang) {

    }
}

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const subCommand = interaction.options.getSubcommand();

    if (commands[subCommand]) {
        commands[subCommand](interaction, client, guild, member, lang);
    }
}


module.exports = { execute, data };