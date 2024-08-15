const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { awaiterCodeId, awaitCodeResolve } = require('./../utils/await-action');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const DiscordSimpleTable = require('discord-simpletable');
const { encryptString } = require('./../utils/crypto');
const Constants = require("../../data/constants");
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('open-contributor')
    .setDescription('Use oAuth with Github to check if you can be an Open-Contributor.')
    .setDescriptionLocalizations({
        de: 'Verknüpfe deinen Github Account um nachzuschauen ob du bereits ein Open-Contributor bist.',
    })


const failedMessage = async (interaction, client, member, lang, type) => {
    await new Embed()
        .setColor(config.embeds.colors.danger)
        .addContext(lang, member, type)
        .interactionResponse(interaction);
};

const createButtonRow = (data, lang) => {
    const userIdEncrypted = encryptString(JSON.stringify(data));
    const githubScopes = 'user:read read:org';
    const oAuthLink = Constants.GIT.OAUTH_LINK(userIdEncrypted, githubScopes);

    const oAuthLinkButton = new ButtonBuilder()
        .setLabel(lang.getText('button-link'))
        .setURL(oAuthLink)
        .setStyle(ButtonStyle.Link);

    return new ActionRowBuilder().addComponents(oAuthLinkButton);
}

const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    if (await DC.memberHasRole(member, config.roles.opencontributor)) {
        failedMessage(interaction, client, member, lang, 'error-already-has-role');
        return;
    }

    const awaitCodeId = awaiterCodeId();
    const data = {
        userId: interaction.user.id,
        awaitCodeId,
        reference: `${interaction.user.id}-open-contributor`
    };

    const row = createButtonRow(data, lang);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ neededcommits: config.commands.opencontributor.commits, neededpr: config.commands.opencontributor.pr })
        .addContext(lang, member, 'initial-message')
        .setComponents([row])
        .interactionResponse(interaction);

    const resolvedAwait = await awaitCodeResolve(client, awaitCodeId, config.commands.opencontributor.authtimeout, data.reference, true);

    if (!resolvedAwait) {
        failedMessage(interaction, client, member, lang, resolvedAwait === false ? 'error-timeout' : 'error-similar-inquiry');
        return;
    }

    const { name, github } = resolvedAwait;

    let table = null;
    let messageType = '';

    if (github.contributions.length === 0) {
        messageType = 'results-no-data';
    } else {
        const columns = [
            { label: lang.getText('repo'), key: 'repository' },
            { label: lang.getText('commits'), key: 'commitCount' },
            { label: lang.getText('prs'), key: 'pullRequestCount' }
        ];

        table = new DiscordSimpleTable(columns)
            .setJsonArrayInputs(github.contributions)
            .setStringOffset(2)
            .addVerticalBar()
            .addIndex(1)
    }

    if (github.totalCommitContributions >= config.commands.opencontributor.commits && github.totalPullRequests >= config.commands.opencontributor.pr) {
        messageType = 'results-complete';
        DC.memberAddRoleId(member, config.roles.opencontributor);
    } else {
        messageType = 'results-not-complete';
    }

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({
            tablestring: await table.build(),
            yourpr: github.totalPullRequests,
            neededpr: config.commands.opencontributor.pr,

            pbpr: progressBar(github.totalPullRequests, config.commands.opencontributor.pr),
            pbcm: progressBar(github.totalCommitContributions, config.commands.opencontributor.commits),

            yourcommits: github.totalCommitContributions,
            neededcommits: config.commands.opencontributor.commits,

            githubname: name
        })
        .addContext(lang, member, messageType)
        .setComponents([])
        .interactionResponse(interaction);
};


module.exports = { execute, data };