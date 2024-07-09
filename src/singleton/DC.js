const Constants = require('./../../data/constants');
const { ChannelType } = require('discord.js');
const config = require('./../../config.json');


class DC {

    /*
    static get channel() {
        return {
            byId() {
                return 'lol'
            }
        };
    } */

    // Interactions options
    static async defer(interaction, ephemeral = true) {
        if (interaction == undefined) {
            console.log(`[DC.defer] Interaction was not defined`, Constants.CONSOLE.ERROR);
            return;
        }
        return await interaction.deferReply({ ephemeral });
    }

    // Member
    static async memberById(userId, guild) {
        try {
            return await guild.members.fetch(userId);
        } catch (err) {
            console.log(`[DC.memberById] Cannot find userId ${userId}`, Constants.CONSOLE.ERROR);
            return undefined;
        }
    }

    static async isTeamMember(member) {
        return await member.roles.cache.has(config.roles.team);
    }

    static async memberHasRole(member, roleId) {
        return await member.roles.cache.has(roleId);
    }

    static async memberVoiceChannel(member) {
        if (member.voice.channel) {
            return member.voice.channel;
        } else {
            return null;
        }
    }

    static async memberAddRoleId(member, roleId) {
        return member.roles.add(roleId);
    }

    // Channel
    static async channelsByGuild(guild) {
        return await guild.channels.fetch();
    }

    static async channelsByParentId(parentid, guild) {
        const allChannels = guild.channels.cache;
        const channelsInCategory = allChannels.filter(channel => channel.parentId === parentid);
        return channelsInCategory;
    }

    static async channelById(channelId, guild) {
        const channel = guild.channels.fetch(channelId);
        return channel;
    }

    static channelByInteraction(interaction, guild) {
        const channel = guild.channels.cache.get(interaction.message.channelId);
        return channel;
    }

    static async removeChannelUserOverrides(channel) {
        const permissionOverwrites = channel.permissionOverwrites.cache;
        const type1Overwrites = permissionOverwrites.filter(overwrite => overwrite.type === Constants.DISCORD.PERMS.USER_OVERRIDE);

        [...type1Overwrites.keys()].forEach(userId => {
            channel.permissionOverwrites.delete(userId);
        });

        console.log(`[Channel Perms] User Perms removed from "${channel.name}"`, Constants.CONSOLE.WORKING);
        return;
    }

    // Messages
    static async messageByChannel(channel, fetchLimit = 100) {
        return await channel.messages.fetch({ limit: fetchLimit });
    }

    static async messagesFromChannel(client, serverid, channelid, fetchLimit = 100) {
        const guild = await this.guildById(serverid, client);
        const channel = await this.channelById(channelid, guild);
        const messages = await this.messageByChannel(channel, fetchLimit);

        return messages;
    }

    // Guild
    static async guildById(guildId, client) {
        return await client.guilds.fetch(guildId);
    }

}


module.exports = DC; 