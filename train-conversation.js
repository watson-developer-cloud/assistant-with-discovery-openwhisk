#! /usr/bin/env node

'use strict';

require('dotenv');
const fs = require('fs');
const replace = require('replace');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

/**
 * Update the .env file to add workspace Id
 * @param  {Object} params
 * @param  {String} params.regexText
 * @param  {String} params.replacement
 */
const updateEnvProperties= function(params) {
  replace({
    regex: params.regexText,
    replacement: params.replacement,
    paths: ['./.env'],
    recursive: true,
    silent: true
  });
};

process.env.VCAP_SERVICES = process.env.VCAP_SERVICES || fs.readFileSync('./credentials.json', 'utf-8');
const assistant = new AssistantV1({ version: '2018-07-10' });
assistant.listWorkspaces(function(err, response) {
  if (err) {
    return;
  } else if (response.workspaces.length > 0 && response.workspaces[0].name === 'Car_Dashboard_New') {
    updateEnvProperties({
      regexText: 'REPLACE WITH YOUR WORKSPACE ID',
      replacement: response.workspaces[0].workspace_id,
    });
  } else {
    assistant.createWorkspace(require('./training/workspace.json'), function(err, response) {
      if (!err) {
        updateEnvProperties({
          regexText: 'REPLACE WITH YOUR WORKSPACE ID',
          replacement: response.workspace_id,
        });
      }
    });
  }
});
