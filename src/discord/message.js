const getMessagesFromChannel = async (channel, max = 100) => {
    return await channel.messages.fetch({ limit: max })
}

module.exports = { getMessagesFromChannel };