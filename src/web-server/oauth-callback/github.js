const { checkOpenContributor } = require('./../../utils/github');
const { decryptString } = require('./../../utils/crypto');
const httpConfig = require('./../../../http-config.json');

module.exports = (req, res, client) => {
    const urlInfo = req.url;

    const [_, code, state] = urlInfo.match(/code=([^&]+).*state=([^&]+)/);

    const data = JSON.parse(decryptString(state));
    checkOpenContributor(data, code, client);

    res.writeHead(302, {
        'Location': httpConfig.oauth.githubconnected,
    });
    res.end();
};