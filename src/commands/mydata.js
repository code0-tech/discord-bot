const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoUser } = require('./../mongo/MongoUser');
const { Embed, COLOR } = require('./../models/Embed');
const { AttachmentBuilder } = require('discord.js');
const Constants = require('../../data/constants');
const config = require('./../../config.json');
const DC = require('./../singleton/DC');


const data = new SlashCommandBuilder()
    .setName('mydata')
    .setDescription('Retrieve your Data which we store in our DB.')
    .setDescriptionLocalizations({
        de: 'Erhalte deine Daten die wir über Dich gespeichert haben.',
    })


const execute = async (interaction, client, guild, member, lang) => {
    await DC.defer(interaction);

    const mongoUser = new MongoUser(member.user.id);

    const jsonString = JSON.stringify(await mongoUser.getJson(), null, 2);

    const buffer = Buffer.from(jsonString, Constants.SETTINGS.ENCODING.UTF8);
    const attachment = new AttachmentBuilder(buffer, { name: 'sample.json' });

    new Embed()
        .setColor(COLOR.INFO)
        .addContext(lang, member, 'your-data')
        .setAttachment(attachment)
        .interactionResponse(interaction);
};


module.exports = { execute, data };