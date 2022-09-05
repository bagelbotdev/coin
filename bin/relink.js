#!/usr/bin/env node

const superagent = require("superagent");

const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .alias("q", "quiet")
  .describe('quiet', 'Run without output')
  .alias("s", "source-node")
  .demandOption('source-node', 'A source node is requied')
  .describe(
    "s",
    "The source node to query peers from. This should be the node with the largest number of peers"
  )
  .help("h")
  .alias("h", "help").argv;

function log(type, msg, nl) {
    if (!argv.quiet) console.log(`${nl ? '\n' : ''}[${type}]\t${msg}`)
}

async function run() {
  log('get', 'looking up peers for source node: ' + argv.sourceNode);

  const res = await superagent.get(`${argv.sourceNode}/node/peers`);
  const peers = res.body.map(({ url }) => url);

  log('info', 'found ' + peers.length + ' nodes');

  for (let targetUrl of peers) {
    log('info', 'selecting node ' + targetUrl, true)

    for (let peerUrl of peers) {
      log('post',
        "sending " +
          JSON.stringify({ url: peerUrl }) +
          " to " +
          targetUrl
      );
      await superagent.post(`${targetUrl}/node/peers`).send({ url: peerUrl });
    }
  }

  log('done', 'nodes relinked', true);

  process.exit(0);
}

run();
