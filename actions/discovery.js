/**
  *
  * Format and send request to Watson Discovery service if marked as necessary.
  *
  * @param {object} params - the parameters.
  * @param {string} params.username - default parameter, must be set. The username for Discovery service.
  * @param {string} params.password - default parameter, must be set. The password for Discovery service.
  * @param {string} params.environment_id - default parameter, must be set. The environment_id for Discovery service.
  * @param {string} params.collection_id - default parameter, must be set. The collection_id for Discovery service
  * @param {string} params.input - input text to be sent to Discovery service.
  * @param {string} params.context - context to be sent with input to Discovery service.
  *
  * @return {object} the JSON of Discovery's response, or the original JSON if discovery was not called.
  *
  */
function main(params) {
	return new Promise(function (resolve, reject) {
	    
	    //Make Discovery request only if Conversation output includes a "call discovery" property
	    if(params.output.hasOwnProperty("action") && params.output.action.hasOwnProperty("call_discovery")) {
            var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
            
            var discovery = new DiscoveryV1({
                username: params.username,
                password: params.password,
                version_date: '2016-12-01'
            });
            
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
                    body = data.results[i].contentHtml;
                    discoveryResults[i] = {
                        body: body,
                        bodySnippet: (body.length < 144 ? body : (body.substring(0,144) + "...")).replace(/<\/?[a-zA-Z]+>/g, ""),
                        confidence: data.results[i].score,
                        id: data.results[i].id,
                        sourceUrl: data.results[i].sourceUrl,
                        title: data.results[i].title
                    }
                    i++;
                }
                
                params.output.discoveryResults = discoveryResults;
                conversation_with_data = params;
                
                return resolve(conversation_with_data);
            });
	    } else {
	        return resolve(params);
	    }
    });
}