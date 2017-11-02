#! /usr/bin/env node

'use strict';

require('dotenv');
const fs = require('fs');
const replace = require('replace');
const watson = require('watson-developer-cloud');
const async = require('async');

/**
 * Update the .env file to add workspace Id
 * @param  {Object} params
 * @param  {String} params.regexText
 * @param  {String} params.replacement
 */
var updateEnvProperties= function(params) {
  replace({
    regex: params.regexText,
    replacement: params.replacement,
    paths: ['./.env'],
    recursive: true,
    silent: true
  });
};

process.env.VCAP_SERVICES = process.env.VCAP_SERVICES || fs.readFileSync('./credentials.json', 'utf-8');

const conversation = new watson.conversation({ version: 'v1', version_date: '2017-04-21' });

conversation.listWorkspaces(function(err, response) {
  if (err) {
    return;
  } else if (response.workspaces.length > 0 && response.workspaces[0].name === 'Car_Dashboard_New') {
    console.log('Workspace exists');
    updateEnvProperties({
      regexText: 'REPLACE WITH YOUR WORKSPACE ID', 
      replacement: response.workspaces[0].workspace_id,
    });
  } else {
    console.log('Creating a workspace...');
    conversation.createWorkspace(require('./training/workspace.json'), function(err, response) {
      if (!err) {
        updateEnvProperties({
          regexText: 'REPLACE WITH YOUR WORKSPACE ID', 
          replacement: response.workspace_id,
        });
      }
    });
  }
});
