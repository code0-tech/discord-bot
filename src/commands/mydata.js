const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { AttachmentBuilder } = require('discord.js');
const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('mydata')
    .setDescription('Retrieve your Data which is stored in our DB.')
    .setDescriptionLocalizations({
        de: 'Erhalte deine Daten die wir über Dich gespeichert haben.',
    })


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const mongoUser = new MongoUser(member.user.id);

    const jsonString = JSON.stringify(await mongoUser.getJson(), null, 2);

    const buffer = Buffer.from(jsonString, 'utf-8');
    const attachment = new AttachmentBuilder(buffer, { name: 'sample.json' });

    new Embed()
        .setColor(config.embeds.colors.info)
        .addContext(lang, member, 'your-data')
        .setAttachment(attachment)
        .interactionResponse(interaction);
};


module.exports = { execute, data };