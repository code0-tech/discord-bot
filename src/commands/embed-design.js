const { ChannelType, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, DiscordjsError, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Embed, progressBar } = require('./../models/Embed');
const { Card } = require('./../models/card/Card');
const { waitMs } = require('./../utils/time');
const config = require('./../../config.json');

const data = new SlashCommandBuilder()
  .setName('embed-design')
  .setDescription('Check Design and Code Stuff')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

const execute = async (interaction, client, guild, member, lang) => {
  await interaction.deferReply({ ephemeral: true });

  const entries = [
    { name: 'User1', level: 10, xp: 1000 },
    { name: 'VeryLongUserName', level: 8, xp: 800 },
    { name: 'User3', level: 12, xp: 1500 }
  ];

  const longestNameLength = Math.max(...entries.map(entry => entry.name.length)) + 3;
  const longestLevelLength = Math.max(...entries.map(entry => entry.level.toString().length)) + 2;
  const longestXPLength = Math.max(...entries.map(entry => entry.xp.toString().length)) + 2;

  const nameHeader = `Name${' '.repeat(Math.max(0, longestNameLength - 4))}`;
  const levelHeader = `Level${' '.repeat(Math.max(0, longestLevelLength - 5))}`;
  const xpHeader = `XP${' '.repeat(Math.max(0, longestXPLength - 2))}`;

  const description = `
  \`\`\`md
  ${nameHeader} ${levelHeader} ${xpHeader}
  ${entries.map((entry, index) => {
    const place = index + 1;
    const nameSpaces = ' '.repeat(longestNameLength - entry.name.length);
    const levelSpaces = ' '.repeat(longestLevelLength - entry.level.toString().length);
    const xpSpaces = ' '.repeat(longestXPLength - entry.xp.toString().length);
    return `${place}. ${entry.name}${nameSpaces}${entry.level}${levelSpaces}${entry.xp}${xpSpaces}`;
  }).join('\n')}
  \`\`\``;

  new Embed()
    .setColor('#0099ff')
    .setTitle('Leaderboard Test')
    .setDescription(description)
    .interactionResponse(interaction);
}



const executeComponent = async (interaction, client, guild, buttonData, member, lang) => {
  const defer = await interaction.deferReply({ ephemeral: true });

  new Embed()
    .setColor(config.embeds.colors.danger)
    .addInputs({ user: "nicusch", age: 21 })
    .addContext(lang, member, '1')
    .addCode0Footer()
    .interactionResponse(interaction)

}

const componentIds = [
  'test-id1'
];

module.exports = { execute, executeComponent, componentIds, data };