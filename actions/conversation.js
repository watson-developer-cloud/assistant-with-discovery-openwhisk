/**
  *
  * Format and send request to Watson Conversation service
  *
  * @param {object} params - the parameters.
  * @param {string} params.iam_apikey - default parameter, must be set. The IAM apikey for Conversation service.
  * @param {string} params.url - default parameter, must be set. The url for Conversation service.
  * @param {string} params.username - default parameter, must be set. The username for Conversation service.
  * @param {string} params.password - default parameter, must be set. The password for Conversation service.
  * @param {string} params.workspace_id - default parameter, must be set. The workspace_id for Conversation service.
  * @param {string} params.input - input text to be sent to Conversation service.
  * @param {string} params.context - context to be sent with input to Converastion service.
  *
  * @return {object} the JSON of Conversation's response.
  *
  */
const assert = require('assert');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

function main(params) {
  return new Promise(function(resolve, reject){
    assert(params, 'params cannot be null');
    assert(params.username || params.iam_apikey, 'params.username and params.iam_apikey cannot be null');
    assert(params.password || params.iam_apikey, 'params.password and params.iam_apikey cannot be null');
    assert(params.workspace_id, 'params.workspace_id cannot be null');
    assert(params.input, 'params.input cannot be null');
    assert(params.context, 'params.context cannot be null');

    let assistant;
    const { iam_apikey, username, password, url } = params;
    if (iam_apikey) {
      assistant = new AssistantV1({
        iam_apikey,
        url,
        version: '2018-07-10',
      });
    }
    else {
      assistant = new AssistantV1({
        username,
        password,
        url,
        version: '2018-07-10',
      });
    }
    assistant.message({
      workspace_id: params.workspace_id,
      input: params.input,
      context: params.context,
    }, function(err, response) {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
}

module.exports.main = main;
