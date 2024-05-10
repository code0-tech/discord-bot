const { EmbedBuilder } = require("discord.js");
const config = require('./../../config.json');

class Embed {
    constructor() {
        /** @type {MessageEmbed} */
        this._embed = new EmbedBuilder()

        this._inputs = {};
    }

    /**
     * Set the color of the embed.
     * @param {string} color - The color to set.
     */
    setColor(color) {
        this._embed.setColor(color);
        return this;
    }

    /**
     * Set the title of the embed.
     * @param {string} text - The text to set as the title.
     */
    setTitle(text) {
        this._embed.setTitle(text);
        return this;
    }

    /**
     * Set the URL of the embed.
     * @param {string} url - The URL to set.
     */
    setURL(url) {
        this._embed.setURL(url);
        return this;
    }

    /**
    * Set the author information for the embed.
    * @param {{ name: string, iconURL?: string, url?: string }} authorObj - The object containing author information.
    */
    setAuthor(authorObj) {
        if (authorObj.name) {
            this._embed.setAuthor(authorObj);
        }
        return this;
    }

    /**
     * Set the description for the embed.
     * @param {string} description - The description to set.
     */
    setDescription(description) {
        if (description) {
            this._embed.setDescription(description);
        }
        return this;
    }

    /**
     * Set the thumbnail for the embed.
     * @param {string} url - The URL of the thumbnail.
     */
    setThumbnail(url) {
        if (url) {
            this._embed.setThumbnail(url);
        }
        return this;
    }

    /**
     * Set the thumbnail for the embed.
     * @param {string} url - The URL of the thumbnail.
     */
    setPbThumbnail(member) {
        this._embed.setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }))
        return this;
    }

    /**
     * Add fields to the embed.
     * @param {{ name: string, value: string, inline?: boolean }[]} fieldsObj - The array of fields.
     */
    addFields(fieldsObj) {
        if (fieldsObj) {
            this._embed.addFields(fieldsObj);
        }
        return this;
    }

    /**
     * Set the image for the embed.
     * @param {string} url - The URL of the image.
     */
    setImage(url) {
        if (url) {
            this._embed.setImage(url);
        }
        return this;
    }

    /**
     * Set the timestamp for the embed.
     */
    setTimestamp() {
        this._embed.setTimestamp();
        return this;
    }

    /**
     * Set the footer information for the embed.
     * @param {string} text - The text of the footer.
     * @param {string} [iconURL] - The URL of the footer's icon.
     */
    setFooter(text, iconURL) {
        if (text) {
            this._embed.setFooter(text, iconURL);
        }
        return this;
    }

    /**
     * Get the underlying MessageEmbed object.
     * @returns {MessageEmbed} - The MessageEmbed object.
     */
    getEmbed() {
        return this._embed;
    }

    /**
     * Set the Code0 footer information for the embed.
     * @param {string} text - Overwrite the text of the footer.
     * @param {string} [iconURL] - Overwrite the URL of the footer's icon.
     */
    addCode0Footer(text = 'Code0', iconURL = config.embeds.avatarurl) {
        this._embed.setFooter({ text, iconURL });
        return this;
    }

    _replacePlaceholders(template, data) {
        return template.replace(/{([^{}]*)}/g, (match, key) => {
            return data[key.trim()];
        });
    }

    /**
     * Add values that will replace the Text values.
     * @param {json} inputs - Overwrite the placeholder values.
     */
    addInputs(inputs) {
        this._inputs = inputs;

        return this;
    }

    /**
     * Set the Context of the Embed based on Inputs and Lang.
     * @param {json} lang - Lang pack delevierd on any Interaction.
     * @param {member} member - Member from the Interaction.
     * @param {id} contextId - Id for the Embed language pack.
     */
    addContext(lang, member, contextId) {
        const embedContext = lang.text[contextId];
        const contextKey = Object.keys(embedContext);

        this._inputs['username'] = member.user.username; // Auto replace username
        this._inputs['userid'] = member.user.id; // Auto replace username


        contextKey.forEach((inputType) => {

            const inputTypeText = embedContext[inputType];

            const finalText = this._replacePlaceholders(inputTypeText, this._inputs)

            switch (inputType) {
                case 'description':
                    this.setDescription(finalText);
                    break;
                case 'title':
                    this.setTitle(finalText);
                    break;
                default:
                    break;
            }

        });

        return this;
    }

    /**
     * Send a response to an interaction.
     * @param {Interaction} interaction - The interaction object.
     * @param {MessageActionRow[]} [components] - The components to include in the message.
     * @param {boolean} [ephemeral=true] - Whether the response should be ephemeral. 
     * @param {string|null} [content=null] - The content of the response.
     * @returns {Promise<void>} - A promise that resolves when the message is sent.
     */
    interactionResponse(interaction, components = [], ephemeral = true, content = null, attachment) {
        return new Promise(async (resolve) => {
            try {
                const responseOptions = {
                    content,
                    embeds: [this.getEmbed()],
                    components,
                    files: attachment ? [attachment] : [], // Only include attachment if it's not null
                    ephemeral
                };

                // Before sending check if is not an Invalid Webhook Token

                const interactionReply = await interaction.editReply(responseOptions);

                resolve(interactionReply);
            } catch (error) {
                console.error(`Error sending interaction response: ${error.message}`);
                throw error;
            }
        })
    }


    /**
         * Send a message to a specific channel with optional components and pin the message.
         * @param {string} channelId - The ID of the channel to send the message to.
         * @param {Client} client - The client to send the message from.
         * @param {MessageActionRow[]} [components] - The components to include in the message.
         * @param {boolean} [pinMessage=false] - Whether to pin the sent message (default: false).
         * @returns {Promise<void>} - A promise that resolves when the message is sent.
         */
    responseToChannel(channelId, client, components, pinMessage = false) {
        return new Promise(async (resolve) => {
            try {
                const channel = await client.channels.fetch(channelId);
                const messageOptions = { embeds: [this.getEmbed()] };

                if (components) {
                    messageOptions.components = components;
                }

                const messageResponse = await channel.send(messageOptions);

                if (pinMessage) {
                    await messageResponse.pin();
                }

                resolve(messageResponse);
            } catch (error) {
                console.error(`Error sending message to channel ${channelId}: ${error.message}`);
                throw error;
            }
        })
    }
}


const progressBar = (total, whole, info = true, segments = 10) => {
    if (total > whole) {
        total = 100;
        whole = 100;
    }

    const percentage = ((total / whole) * 100).toFixed(2);

    let filledSegments = Math.round((percentage / 100) * segments);
    let emptySegments = segments - filledSegments;

    let string = '';
    let end = '';

    if (filledSegments >= segments) {
        end = config.embeds.progressbar.pbr1;
        filledSegments--;
    } else {
        end = config.embeds.progressbar.pbr0;
        if (emptySegments > 0) {
            emptySegments--;
        }
    }

    if (filledSegments >= 1) {
        string = config.embeds.progressbar.pbl1;
        if (filledSegments == 0) {
            emptySegments--;
        } else {
            filledSegments--;
        }
    } else {
        emptySegments--;
        string = config.embeds.progressbar.pbl0;
    }

    string += config.embeds.progressbar.pbm1.repeat(filledSegments);
    string += config.embeds.progressbar.pbm0.repeat(emptySegments);


    if (info) {
        end += " " + percentage + "%";
    }


    return string + end;
}


module.exports = { Embed, progressBar };