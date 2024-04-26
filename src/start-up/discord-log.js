const { config } = require('./../../config.json');
const { Card } = require('./../models/card/Card');

const dLog = () => {

    new Card()
        .header({}, card => {
            card.headerIcon({ value: 'X' }, card => { })
            card.headerTitle({ value: 'How to become an Open Contributor' }, card => { })
            card.label({ value: 'Contributor' }, card => { })
        })
        .body({}, card => {
            card.title({ value: 'Guidelines' }, card => { })
            card.description({ value: 'For becoming an Open Contributor and its roles you must fulfill the following things:' }, card => { })
            card.divider({}, card => { })
            card.description({ value: `1. Have ${config.commands.opencontributor.commits} or more commits` }, card => { })
            card.description({ value: `2. Have ${config.commands.opencontributor.pr} or more pull requests` }, card => { })
            card.divider({}, card => { })
            card.description({ value: `You can check or get the role by using /open-contributer` }, card => { })
        })
        .footer({}, card => {
            card.footerIcon({ value: 'X' }, card => { })
            card.footerTitle({ value: 'Code0 • Open Contributor' }, card => { })
        })
        .interactionResponse(interaction)

}

const setup = (client) => {

    // const guild = await client.guilds.fetch(guildId);
    // const debugChannel = guild.channels.cache.get(config.serverid);



    console['dLog'] = dLog

}

module.exports = { setup };