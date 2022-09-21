const superagent = require('superagent');
const { getJwt } = require("./jwt");

async function registerSelf(host, iden) {
    const jwt = getJwt(host, iden);

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