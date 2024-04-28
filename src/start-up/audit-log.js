const { Events } = require('discord.js');
const config = require('./../../config.json');
const { Card } = require('./../models/card/Card');

const setup = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(config.channels.auditlog);

    let eventHand = [];

    const sendEvent = async (event) => {
        // const username = guild.members.cache.get(event.executorId);

        const attachment = await new Card()
            .header({}, card => {
                card.headerIcon({ value: 'X' }, card => { });
                card.headerTitle({ value: `Executer: ${event.executorId}` }, card => { });
                card.label({ value: 'Debug' }, card => { });
            })
            .body({}, card => {
                card.description({ value: `targetType: ${event.targetType}, actionType: ${event.actionType}, action: ${event.action}` }, card => { });
                card.divider({}, card => { });
                card.description({ value: `Changes:` }, card => { });
                card.description({ value: `${JSON.stringify(event.changes)}` }, card => { });
                card.divider({}, card => { });
                card.description({ value: `TargetId: ${event.targetId}` }, card => { });
            })
            .footer({}, card => {
                card.footerIcon({ value: 'X' }, card => { });
                card.footerTitle({ value: 'Code0 • Go and click, dont skip' }, card => { });
            })
            .getAttachment();


        const messageOptions = { files: [attachment] };

        await channel.send(messageOptions);
    }


    setInterval(() => {
        if (eventHand.length !== 0) {
            const event = eventHand.shift();
            sendEvent(event);
        }
    }, 5000);

    client.on(Events.GuildAuditLogEntryCreate, auditLog => {
        eventHand.push(auditLog);
    })
};


module.exports = { setup };