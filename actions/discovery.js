/**
  *
  * Format and send request to Watson Discovery service if marked as necessary.
  *
  * @param {object} params - the parameters.
  * @param {string} params.iam_apikey - default parameter, must be set. The IAM apikey for Discovery service.
  * @param {string} params.url - default parameter, must be set. The url for Discovery service.
  * @param {string} params.username - default parameter, must be set. The username for Discovery service.
  * @param {string} params.password - default parameter, must be set. The password for Discovery service.
  * @param {string} params.environment_id - default parameter, must be set. The environment_id for Discovery service.
  * @param {string} params.collection_id - default parameter, must be set. The collection_id for Discovery service
  * @param {string} params.input - input text to be sent to Discovery service.
  * @param {string} params.output - the output of the Conversation service results
  *
  * @return {object} the JSON of Discovery's response, or the original JSON if discovery was not called.
  *
  */
const assert = require('assert');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

function main(params) {
  return new Promise(function (resolve, reject) {
    assert(params, 'params cannot be null');
    assert(params.username || params.iam_apikey, 'params.username and params.iam_apikey cannot be null');
    assert(params.password || params.iam_apikey, 'params.password and params.iam_apikey cannot be null');
    assert(params.environment_id, 'params.environment_id cannot be null');
    assert(params.collection_id, 'params.collection_id cannot be null');
    assert(params.input, 'params.input cannot be null');
    assert(params.output, 'params.output cannot be null');
    assert(params.input, 'params.input cannot be null');

    // Make Discovery request only if Conversation output includes a "call discovery" property
    if (params.output.hasOwnProperty('action') && params.output.action.hasOwnProperty('call_discovery')) {

      let discovery;
      const { iam_apikey, username, password, url } = params;
      if (iam_apikey) {
        discovery = new DiscoveryV1({
          iam_apikey,
          url,
          version: '2018-03-05',
        });
      }
      else {
        discovery = new DiscoveryV1({
          username,
          password,
          url,
          version: '2018-03-05',
        });
      }

      discovery.query({environment_id: params.environment_id,
        collection_id: params.collection_id,
        query: params.input.text
      }, function(err, data) {
        if (err) {
          return reject(err);
        }
        var i = 0;
        var discoveryResults = [];
        while (data.results[i] && i < 3 ) {
          let body = data.results[i].contentHtml;
          discoveryResults[i] = {
            body: body,
            bodySnippet: (body.length < 144 ? body : (body.substring(0,144) + '...')).replace(/<\/?[a-zA-Z]+>/g, ''),
            confidence: data.results[i].score,
            id: data.results[i].id,
            sourceUrl: data.results[i].sourceUrl,
            title: data.results[i].title
          };
          i++;
        }

        params.output.discoveryResults = discoveryResults;
        var conversationWithData = params;
        delete conversationWithData.username;
        delete conversationWithData.password;
        return resolve(conversationWithData);
      });
    } else {
      let returnJson = params;
      delete returnJson.environment_id;
      delete returnJson.collection_id;
      delete returnJson.username;
      delete returnJson.password;
      return resolve(params);
    }
  });
}

module.exports.main = main;
