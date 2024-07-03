const config = require('./../../config.json');

const USER_OVERRIDE = 1;

class DC {

    // interactions options
    static async defer(interaction, ephemeral = true) {
        return await interaction.deferReply({ ephemeral });
    }

    // member
    static async memberById(userId, guild) {
        try {
            return await guild.members.fetch(userId);
        } catch (err) {
            console.log(`[DC.memberById] Cannot find userId ${userId}`);
            return undefined;
        }
    }

    static async isTeamMember(member) {
        return await member.roles.cache.has(config.roles.team);
    }

    // channel
    static async channelsByParentId(parentid, guild) {
        const allChannels = guild.channels.cache;
        const channelsInCategory = allChannels.filter(channel => channel.parentId === parentid);
        return channelsInCategory;
    }

    static async channelById(channelId, guild) {
        const channel = guild.channels.cache.get(channelId);
        return channel;
    }

    static channelByInteraction(interaction, guild) {
        const channel = guild.channels.cache.get(interaction.message.channelId);
        return channel;
    }

    static async removeChannelUserOverrides(channel) {
        const permissionOverwrites = channel.permissionOverwrites.cache;
        const type1Overwrites = permissionOverwrites.filter(overwrite => overwrite.type === USER_OVERRIDE);

        [...type1Overwrites.keys()].forEach(userId => {
            channel.permissionOverwrites.delete(userId);
        });

        return;
    }

    // messages
    static async messageByChannel(channel, fetchLimit = 100) {
        return await channel.messages.fetch({ limit: fetchLimit });
    }

    static async messagesFromChannel(client, serverid, channelid, fetchLimit = 100) {
        const guild = await this.guildById(serverid, client);
        const channel = await this.channelById(channelid, guild);
        const messages = await this.messageByChannel(channel, fetchLimit);

        return messages;
    }

    // guild
    static async guildById(guildId, client) {
        return await client.guilds.fetch(guildId);
    }

}


module.exports = DC; 