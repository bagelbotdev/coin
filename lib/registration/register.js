const superagent = require('superagent');
const { version } = require('../../package.json');
const JWT = require('jsonwebtoken');

async function registerSelf(host, iden) {
    const { secret, token } = iden;

    const jwt = JWT.sign({
        tok: token,
        ver: version,
        loc: host
    }, secret);

    const res = await superagent.post('https://bagelbot.erwijet.com/v1/hosts').set('Authorization', 'Bearer ' + jwt);

    if (res.statusCode == 200) return true;
    else if (res.statusCode == 400) {
        console.log('error! attempted to join bryxcoin network but was rejected with the following justification: ' + JSON.parse(res.body).justification)
        return false;
    } else {
        console.log('error! attempted to join bryxcoin network, but the request failed: ' + res.body);
        return false
    }
}

module.exports = { registerSelf };