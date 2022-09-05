#!/usr/bin/env node

const fs = require("fs");

const Blocks = require("../lib/blockchain/blocks");
const Block = require("../lib/blockchain/block");
const Miner = require("../lib/miner/index");

const argv = require("yargs")
  .usage("Usage: $0 [options]")
  .alias("q", "quiet")
  .describe("quiet", "Run without output")
  .boolean('quiet')
  .alias("o", "outfile")
  .describe("outfile", "The desired path for the new blockchain json file")
  .alias("f", "file")
  .describe("file", "JSON file to load blockchain from")
  .alias("i", "interval")
  .describe(
    "interval",
    "The block interval with which to increment the difficulty"
  )
  .alias("c", "curve")
  .describe("curve", "The proof of work curve rate")
  .demandOption("file")
  .demandOption("file")
  .demandOption("interval")
  .demandOption("curve")
  .help("h")
  .alias("h", "help").argv;

function log(type, msg, nl) {
  if (!argv.quiet) console.log(`${nl ? "\n" : ""}[${type}]\t${msg}`);
}

function getLocalDifficulty(blocks) {
  const BASE_DIFFICULTY = Number.MAX_SAFE_INTEGER;

  return Math.max(
    Math.floor(
      BASE_DIFFICULTY /
        Math.pow(Math.floor((blocks.length + 1) / Number.parseInt(argv.interval)) + 1, Number.parseInt(argv.curve))
    ),
    0
  );
}

function getLast(arr) {
  return arr.at(arr.length - 1);
}

function run() {
  const blocks = Blocks.fromJson(JSON.parse(fs.readFileSync(argv.file)));
  const newBlocks = [];

  // transfer genesis block (no associated POW)
  newBlocks.push({ ...blocks.shift() });

  for (let blockSpec of blocks) {
    
    // reset nonce of old block, but update with the new hash of the last updated block
    const block = Block.fromJson({ ...blockSpec, nonce: 0, previousHash: getLast(newBlocks).hash });

    // find a new nonce that yields a hash compliant with the updated difficulty spec
    const { nonce, hash, timestamp } = Miner.proveWorkFor(block, getLocalDifficulty(newBlocks), argv.quiet);

    newBlocks.push({ ...block, nonce, hash, timestamp });
  }

  if (argv.outfile)
    fs.writeFileSync(argv.outfile, JSON.stringify(newBlocks));
  else
    process.stdout.write(JSON.stringify(newBlocks));
}

run();
