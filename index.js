#!/usr/bin/env node

const program = require('caporal');
const createCmd = require('./lib/create');

program
  .version('1.0.0')
  .command('create', 'Scaffold a new service portal using templates')
  .option('-t, --template <template>', 'Which <template> is applied')
  .action(createCmd);

program.parse(process.argv);