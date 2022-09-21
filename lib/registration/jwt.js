const JWT = require('jsonwebtoken');
const { version } = require('../../package.json');

function getJwt(host, iden) {
    const { secret, token } = iden;

    return JWT.sign({
        tok: token,
        ver: version,
        loc: host
    }, secret);
}

module.exports = { getJwt };