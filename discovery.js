function main(params) {
	return new Promise(function (resolve, reject) {
	    
	    if(params.output.hasOwnProperty("action") && params.output.action.hasOwnProperty("call_discovery")) {
            var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
            
            var discovery = new DiscoveryV1({
                username: 'a6c31267-0df9-4eee-b241-36ca88d086bf',
                password: 'xvVClL4c4UjU',
                version_date: '2016-12-01'
            });
            
            discovery.query({environment_id: 'efe07e7a-790d-4604-8761-aed0d2f42a56',
            collection_id: '3cf3558e-9bbe-40e1-9da4-a487a5d36ff0',
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
                        bodySnippet: body.length < 144 ? body : (body.substring(0,144) + "..."),
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