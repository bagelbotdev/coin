const HttpServer = require('./httpServer');
const Blockchain = require('./blockchain');
const Operator = require('./operator');
const Miner = require('./miner');
const Node = require('./node');
const { registerSelf } = require('./registration/register');
const { getJwt } = require('./registration/jwt');

const superagent = require('superagent');

module.exports = async function naivecoin(host, port, peers, logLevel, name, iden) {
    host = process.env.HOST || host || 'localhost';
    port = process.env.PORT || process.env.HTTP_PORT || port || 3001;
    peers = (process.env.PEERS ? process.env.PEERS.split(',') : peers || []);
    peers = peers.map((peer) => { return { url: peer }; });
    logLevel = (process.env.LOG_LEVEL ? process.env.LOG_LEVEL : logLevel || 6);    
    name = process.env.NAME || name || '1';

    const token = process.env.IDENTITY_TOKEN ?? iden.token;
    const secret = process.env.IDENTITY_SECRET ?? iden.secret;

    console.log({ token, secret });

    if (!token) throw 'no IDENTITY_TOKEN specified!';
    if (!secret) throw 'no IDENTITY_SECRET specified!';
    if (!host) throw 'no HOST specified!';

    require('./util/consoleWrapper.js')(name, logLevel);

    console.info(`Starting node ${name}`);
    console.info(`Attempting to join the bryxcoin network...`);

    const owner_address = (await superagent.get('https://bagelbot.erwijet.com/v1/users/' + token)).body.bryxcoin_address;

    const success = await registerSelf(host, { token, secret });
    if (success) console.info(`Success!`)
    else process.exit(1);

    let blockchain = new Blockchain(name);
    let operator = new Operator(name, blockchain);
    let miner = new Miner(blockchain, logLevel);
    let node = new Node(host, port, peers, blockchain);
    let httpServer = new HttpServer(node, blockchain, operator, miner, secret, owner_address);

    httpServer.listen(host, port);
};
