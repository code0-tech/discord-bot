const findOption = (key, interaction) => {
    const foundObject = interaction.options._hoistedOptions.find(obj => obj.name === key);
    return foundObject ? foundObject.value : null;
}


module.exports = { findOption };