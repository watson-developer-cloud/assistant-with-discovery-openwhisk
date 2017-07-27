/**
  *
  * Format and send request to Watson Conversation service
  *
  * @param {object} params - the parameters.
  * @param {string} params.username - default parameter, must be set. The username for Conversation service.
  * @param {string} params.password - default parameter, must be set. The password for Conversation service.
  * @param {string} params.workspace_id - default parameter, must be set. The workspace_id for Conversation service.
  * @param {string} params.input - input text to be sent to Conversation service.
  * @param {string} params.context - context to be sent with input to Converastion service.
  *
  * @return {object} the JSON of Conversation's response.
  *
  */
function main(params) {
  return new Promise(function(resolve, reject){
    var watson = require('watson-developer-cloud');
    var conversation = watson.conversation({
      username: params.username,
      password: params.password,
      version: 'v1',
      version_date: '2017-05-26'
    });
        
    conversation.message({
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

export default main;