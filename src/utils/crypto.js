const Constants = require('../../data/constants');
const crypto = require('crypto');

const key = crypto.scryptSync(process.env.CRYPTO_KEY, Constants.CRYPTO.SALT, Constants.CRYPTO.KEYLEN);

const encryptString = (string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(Constants.CRYPTO.ALGORITHM, key, iv);
    let encrypted = cipher.update(string, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decryptString = (encryptedString) => {
    if (!encryptedString || !encryptedString.includes(':')) {
        throw new Error('Invalid encrypted string format');
    }

    const [ivHex, encrypted] = encryptedString.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(Constants.CRYPTO.ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


module.exports = { encryptString, decryptString };