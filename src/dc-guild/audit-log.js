const { Card } = require('../models/card/Card');
const { Embed } = require('../models/Embed');
const config = require('../../config.json');
const { Events } = require('discord.js');
const AUDIT_LOG_ACTIONS = require('../../data/discord/action-ids');
const OVERWRITE_PERMISSIONS = require('../../data/discord/permission-ids');
const DC = require('../singleton/DC');

const setup = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(config.channels.auditlog);

    let eventHand = [];

    const sendEvent = async (event) => {
        /* const actionId = event.action;

        console.log(event)

        let description = "";

        if (actionId == 14 && event.changes) {// CHANNEL_OVERWRITE_UPDATE
            description += event.changes.map(change => {
                let oldValue = change.old;
                let newValue = change.new;

                if (Array.isArray(oldValue)) {
                    oldValue = oldValue.join(', ');
                }
                if (Array.isArray(newValue)) {
                    newValue = newValue.join(', ');
                }

                return `\`${change.key}\` from \`${OVERWRITE_PERMISSIONS[oldValue]}\` to \`${OVERWRITE_PERMISSIONS[newValue]}\``;
            }).join('\n');
        }

        new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle(`${AUDIT_LOG_ACTIONS[actionId]} (action: ${actionId})`)
            .setDescription(description)
            .responseToChannel(config.channels.auditlog, client);
        */

        const attachment = await new Card()
            .header({}, card => {
                card.headerIcon({ value: 'X' }, card => { });
                card.headerTitle({ value: `Executer: ${event.executorId}` }, card => { });
                card.label({ value: 'Debug' }, card => { });
            })
            .body({}, card => {
                card.description({ value: `targetType: ${event.targetType}, actionType: ${event.actionType}, action: ${AUDIT_LOG_ACTIONS[event.action]}` }, card => { });
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
        sendEvent(auditLog);
    })
};


module.exports = { setup };