#! /usr/bin/env node

'use strict';

var replace = require('replace');
var creds = require('./credentials.json');

replace({
  regex: '<CONVERSATION_NAME>',
  replacement: creds.conversation[0].name,
  paths: ['./manifest.yml'],
  recursive: true,
  silent: true
});

replace({
  regex: '<DISCOVERY_NAME>',
  replacement: creds.discovery[0].name,
  paths: ['./manifest.yml'],
  recursive: true,
  silent: true
});
