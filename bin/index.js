#!/usr/bin/env node

import {cliBasics} from 'command-line-basics';
import {filesizeBadger as mainScript} from '../src/index.js';

const optionDefinitions = await cliBasics(
  import.meta.dirname + '/../src/optionDefinitions.js',
  {
    packageJsonPath: import.meta.dirname + '/../package.json'
  }
);

if (!optionDefinitions) { // cliBasics handled
  process.exit();
}

// Use `optionDefinitions`
await mainScript(optionDefinitions);
