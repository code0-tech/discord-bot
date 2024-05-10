const { Embed } = require('./../models/Embed');
const config = require('./../../config.json');
const { Events } = require('discord.js');
const { Card } = require('./../models/card/Card');

const setup = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache.get(config.channels.auditlog);

    let eventHand = [];

    const sendEvent = async (event) => {
        /* const username = event.executor.username;


        console.dir(event, { depth: null, breakLength: 0 });

        let changes = "";

        event.changes.forEach(change => {
            let oldValue = change.old;
            let newValue = change.new;

            // If the old or new value is an array, format it as a string
            if (Array.isArray(oldValue)) {
                oldValue = oldValue.join(", ");
            }
            if (Array.isArray(newValue)) {
                newValue = newValue.join(", ");
            }

            changes += `\n\`${change.key}\` from \`${oldValue}\` to \`${newValue}\``;
        });

        new Embed()
            .setColor(config.embeds.colors.info)
            .setTitle(`Target: ${event.targetType}`)
            .setDescription(`
        Action: ${event.actionType}
        ${changes}
        
        
        `).responseToChannel(config.channels.auditlog, client);
 */
        
 
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