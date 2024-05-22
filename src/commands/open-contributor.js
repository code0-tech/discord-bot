const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { awaiterCodeId, awaitCodeResolve } = require('./../utils/await-action');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { encryptString } = require('./../utils/crypto');
const config = require('./../../config.json');


const data = new SlashCommandBuilder()
    .setName('open-contributor')
    .setDescription('Use oAuth with Github to check if you can be an Open-Contributor.')


const failedMessage = async (interaction, client, member, lang, type) => {

    await new Embed()
        .setColor(config.embeds.colors.danger)
        .addContext(lang, member, type)
        .addCode0Footer()
        .interactionResponse(interaction);

};


const execute = async (interaction, client, guild, member, lang) => {
    await interaction.deferReply({ ephemeral: true });

    // Check if role is already present
    if (member.roles.cache.has(config.roles.opencontributor)) {
        // User already has the role, show appropriate message
        failedMessage(interaction, client, member, lang, 'error-already-has-role');
        return;
    }

    // User has no role, generate GitHub OAuth Link + reference id
    const awaitCodeId = awaiterCodeId();
    const data = {
        userId: interaction.user.id,
        awaitCodeId,
        reference: `${interaction.user.id}-open-contributor`
    };

    const userIdEncrypted = encryptString(JSON.stringify(data));
    const githubScopes = 'user:read read:org';
    const oAuthLink = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${userIdEncrypted}&scope=${encodeURIComponent(githubScopes)}`;

    // Create a link button for the GitHub OAuth link
    const oAuthLinkButton = new ButtonBuilder()
        .setLabel('Github OAuth Link')
        .setURL(oAuthLink)
        .setStyle(ButtonStyle.Link);

    // Create an action row with the link button
    const row = new ActionRowBuilder().addComponents(oAuthLinkButton);

    await new Embed()
        .setColor(config.embeds.colors.info)
        .addInputs({ neededcommits: config.commands.opencontributor.commits, neededpr: config.commands.opencontributor.pr })
        .addContext(lang, member, 'initial-message')
        .addCode0Footer()
        .interactionResponse(interaction, [row]);

    // Await if user used the link or not, then perform action
    const resolvedAwait = await awaitCodeResolve(client, awaitCodeId, 120000, data.reference, true);

    if (!resolvedAwait) {
        // Handle timeout or similar inquiry
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
                repostring,
                yourpr: github.totalPullRequests,
                neededpr: config.commands.opencontributor.pr,

                pbpr: progressBar(github.totalPullRequests, config.commands.opencontributor.pr),
                pbcm: progressBar(github.totalCommitContributions, config.commands.opencontributor.commits),

                yourcommits: github.totalCommitContributions,
                neededcommits: config.commands.opencontributor.commits,

                githubname: name

            })
            .addContext(lang, member, messageType)
            .addCode0Footer()
            .interactionResponse(interaction, [row]);

    }
};



const componentIds = [];

module.exports = { execute, componentIds, data };