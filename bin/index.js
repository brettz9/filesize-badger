#!/usr/bin/env node

import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {cliBasics} from 'command-line-basics';
import {filesizeBadger as mainScript} from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const optionDefinitions = await cliBasics(
  join(__dirname, '../src/optionDefinitions.js')
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// Use `optionDefinitions`
await mainScript(optionDefinitions);
