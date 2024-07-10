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
            let member = guild.members.cache.get(userId);

            if (member) {
                console.log(`[DC.memberById] UserId ${userId} found in cache`, Constants.CONSOLE.FOUND);
            } else {
                member = await guild.members.fetch(userId);
                console.log(`[DC.memberById] UserId ${userId} fetched from API`, Constants.CONSOLE.FOUND);
            }

            return member;
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

    static async channelsByParentId(parentId, guild) {
        try {
            const allChannels = guild.channels.cache;
            const channelsInCategory = allChannels.filter(channel => channel.parentId === parentId);
            console.log(`[DC.channelsByParentId] Channels for parentId ${parentId} found in cache`, Constants.CONSOLE.FOUND);
            return channelsInCategory;
        } catch (err) {
            console.log(`[DC.channelsByParentId] Cannot find channels for parentId ${parentId}`, Constants.CONSOLE.ERROR);
            return undefined;
        }
    }

    static async channelById(channelId, guild) {
        try {
            let channel = guild.channels.cache.get(channelId);

            if (channel) {
                console.log(`[DC.channelById] ChannelId ${channelId} found in cache`, Constants.CONSOLE.FOUND);
            } else {
                channel = await guild.channels.fetch(channelId);
                console.log(`[DC.channelById] ChannelId ${channelId} fetched from API`, Constants.CONSOLE.FOUND);
            }

            return channel;
        } catch (err) {
            console.log(`[DC.channelById] Cannot find channelId ${channelId}`, Constants.CONSOLE.ERROR);
            return undefined;
        }
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