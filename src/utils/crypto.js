const crypto = require('crypto');

const encryptString = (string) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.CRYPTO_KEY);
    let encrypted = cipher.update(string, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptString = (encryptedString) => {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.CRYPTO_KEY);
    let decrypted = decipher.update(encryptedString, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


module.exports = { encryptString, decryptString };