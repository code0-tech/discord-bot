const { AttachmentBuilder, Attachment } = require("discord.js");
const { convertJsonToHtml } = require('./html-builder');

const config = require('./../../../config.json');

class Card {
    constructor() {
        this._cards = [];
    }

    /**
     * Get the cards[] containing the .
     * @returns {this._cards[]} - The Cards Array.
     */
    getJson() {
        return this._cards;
    }

    /**
     * Get the current generated Html by using the Json from this Class.
     * @returns {string} - Html as a String.
     */
    getHtml() {
        return new Promise(async (resolve) => {
            const cardsHtml = await convertJsonToHtml(this._cards);
            resolve(cardsHtml);
        })
    }

    /**
     * Get the Attachment for Discord filled with the ImageBuffer from the Html screenshot.
     * @returns {Attachment} - Image Attachment.
     */
    getAttachment() {
        return new Promise(async (resolve) => {
            const page = await global.renderPuppeteer.newPage();

            await page.setContent(await this.getHtml());

            await page.waitForSelector('.card');

            const elementHandle = await page.$('.card');
            const imageBuffer = await elementHandle.screenshot({ omitBackground: true });

            // await global.renderPuppeteer.close();
            await page.close();

            const attachment = new AttachmentBuilder(imageBuffer, 'image.png');

            resolve(attachment);
        })
    }

    /**
     * Get the Embed for Discord.
     * @returns {Embed} - Embed.
     */
    getEmbed() {
        return new Promise(async (resolve) => {
            const embed = await convertJsonToEmbed(this._cards);
            resolve(embed);
        })
    }

    /**
     * Send the reponse [image/embed depending on user role] to the User.
     * @param {Interaction} interaction - The interaction object.
     * @param {Client} client - The client to send the message from.
     * @param {Guild} guild - The guild where the message comes from.
     * @param {MessageActionRow[]} [components] - The components to include in the message.
     * @param {boolean} [ephemeral=true] - Whether the response should be ephemeral.
     * @param {string} [overwriteResponseType = 'USER_ROLE_CHECK'] - What should the reponse be? Role Based: USER_ROLE_CHECK, Image: IMAGE, Embed: EMBED, or both: EMBED_AND_IMAGE.
     * @returns {Promise<void>} - Interaction Response.
     */
    interactionResponse(interaction, components, ephemeral = true) {
        return new Promise(async (resolve) => {

            const attachment = await this.getAttachment()

            const responseOptions = {
                // content: 'null',
                files: [attachment], // Only include attachment if it's not null
                ephemeral: true
            };

            if (components) {
                responseOptions.components = components;
            }

            const interactionReply = await interaction.editReply(responseOptions);

            resolve(interactionReply);
        })
    }

    _addCard(type, options = {}, fn = () => { }) {
        const card = new Card();
        fn(card);

        this._cards.push({ type, options, items: card._cards });
        return this;
    }

    /**
    * Sets header
    * @param {Object} options - Header options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    header(options = {}, fn = () => { }) {
        return this._addCard('header', options, fn);
    }

    /**
    * Sets headerWrapper
    * @param {Object} options - headerWrapper options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    headerWrapper(options = {}, fn = () => { }) {
        return this._addCard('headerWrapper', options, fn);
    }

    /**
    * Sets body
    * @param {Object} options - Body options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    body(options = {}, fn = () => { }) {
        return this._addCard('body', options, fn);
    }

    /**
    * Sets footer
    * @param {Object} options - Footer options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    footer(options = {}, fn = () => { }) {
        return this._addCard('footer', options, fn);
    }

    /**
    * Sets headerIcon
    * @param {Object} options - HeaderIcon options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    headerIcon(options = {}, fn = () => { }) {
        return this._addCard('headerIcon', options, fn);
    }

    /**
    * Sets headerTitle
    * @param {Object} options - HeaderTitle options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    headerTitle(options = {}, fn = () => { }) {
        return this._addCard('headerTitle', options, fn);
    }

    /**
    * Sets footerIcon
    * @param {Object} options - FooterIcon options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    footerIcon(options = {}, fn = () => { }) {
        return this._addCard('footerIcon', options, fn);
    }

    /**
    * Sets footerTitle
    * @param {Object} options - FooterTitle options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    footerTitle(options = {}, fn = () => { }) {
        return this._addCard('footerTitle', options, fn);
    }

    /**
    * Sets divider
    * @param {Object} options - Divider options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    divider(options = {}, fn = () => { }) {
        return this._addCard('divider', options, fn);
    }

    /**
    * Sets title
    * @param {Object} options - Title options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    title(options = {}, fn = () => { }) {
        return this._addCard('title', options, fn);
    }

    /**
    * Sets label
    * @param {Object} options - Label options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    label(options = {}, fn = () => { }) {
        return this._addCard('label', options, fn);
    }

    /**
    * Sets subTitle
    * @param {Object} options - SubTitle options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    subTitle(options = {}, fn = () => { }) {
        return this._addCard('subTitle', options, fn);
    }

    /**
    * Sets description
    * @param {Object} options - Description options.
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    description(options = {}, fn = () => { }) {
        return this._addCard('description', options, fn);
    }

    /**
    * Sets progressBar
    * @param {Object} options - ProgressBar options [label: false|true].
    * @param {Function} fn - Callback function to customize the nested Element.
    * @returns {ThisType<Card>} - Returns an instance of the Card class.
    */
    progressBar(options = {}, fn = () => { }) {
        if (options.label) {
            options['flags'] = {
                label: true
            }
        }

        if (options.value > 100) {
            options.value = 100;
        }

        return this._addCard('progressBar', options, fn);
    }

}


const calculatePercentage = (total, whole) => {
    return (total / whole) * 100;
}


// Info
// This code is from the early days of our bot's development and is now considered outdated. 
// It was originally used to create Cards, which were used as embeds.
// However, as our bot has evolved, we are transitioning to a more advanced and efficient system using discord-embeds.
// The embeds will replace the Cards, providing a richer, more interactive experience.
// ~Nicusch

module.exports = { Card, calculatePercentage };