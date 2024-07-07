const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { awaiterCodeId, awaitCodeResolve } = require('./../utils/await-action');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { encryptString } = require('./../utils/crypto');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('open-contributor')
    .setDescription('Use oAuth with Github to check if you can be an Open-Contributor.')


const failedMessage = async (interaction, client, member, lang, type) => {
    await new Embed()
        .setColor(config.embeds.colors.danger)
        .addContext(lang, member, type)
        .interactionResponse(interaction);
};


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

    const userIdEncrypted = encryptString(JSON.stringify(data));
    const githubScopes = 'user:read read:org';
    const oAuthLink = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${userIdEncrypted}&scope=${encodeURIComponent(githubScopes)}`;

    const oAuthLinkButton = new ButtonBuilder()
        .setLabel('Github OAuth Link')
        .setURL(oAuthLink)
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(oAuthLinkButton);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ neededcommits: config.commands.opencontributor.commits, neededpr: config.commands.opencontributor.pr })
        .addContext(lang, member, 'initial-message')
        .interactionResponse(interaction, [row]);

    const resolvedAwait = await awaitCodeResolve(client, awaitCodeId, config.commands.opencontributor.authtimeout, data.reference, true);

    if (!resolvedAwait) {
        failedMessage(interaction, client, member, lang, resolvedAwait === false ? 'error-timeout' : 'error-similar-inquiry');
    } else {
        const { name, github } = resolvedAwait;

        let repostring = ""; // add repo string later when my design idea is better
        let messageType = '';

        if (github.contributions.length === 0) {
            messageType = 'results-no-data';
        } else {
            github.contributions.forEach(obj => {
                repostring += `\n\`Repo: ${obj.repository}, commits: ${obj.commitCount}, Pull Request's: ${obj.pullRequestCount}\``;
            });
        }

        if (github.totalCommitContributions >= config.commands.opencontributor.commits && github.totalPullRequests >= config.commands.opencontributor.pr) {
            messageType = 'results-complete';
            member.roles.add(config.roles.opencontributor);
        } else {
            messageType = 'results-not-complete';
        }

        await new Embed()
            .setColor(config.embeds.colors.info)
            .addInputs({
                repostring, // unused
                yourpr: github.totalPullRequests,
                neededpr: config.commands.opencontributor.pr,

                pbpr: progressBar(github.totalPullRequests, config.commands.opencontributor.pr),
                pbcm: progressBar(github.totalCommitContributions, config.commands.opencontributor.commits),

                yourcommits: github.totalCommitContributions,
                neededcommits: config.commands.opencontributor.commits,

                githubname: name
            })
            .addContext(lang, member, messageType)
            .interactionResponse(interaction, [row]);

    }
};


module.exports = { execute, data };