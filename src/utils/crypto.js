const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.CRYPTO_KEY, 'salt', 32);

const encryptString = (string) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(string, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
};

const decryptString = (encryptedString) => {
    console.log('Received encryptedString:', encryptedString);
    if (!encryptedString || !encryptedString.includes(':')) {
        throw new Error('Invalid encrypted string format');
    }

    const [ivHex, encrypted] = encryptedString.split(':');
    console.log('IV:', ivHex);
    console.log('Encrypted data:', encrypted);

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


module.exports = { encryptString, decryptString };