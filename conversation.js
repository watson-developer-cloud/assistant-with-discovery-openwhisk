function main(params) {
    return new Promise(function(resolve, reject){
        var watson = require('watson-developer-cloud');
        var conversation = watson.conversation({
            username: "0e18737d-f26f-46bd-94f5-5f50c3ecd1eb",
            password: "5AqHqjFoIvhX",
            version: "v1",
            version_date: "2017-05-26"
        });
        
        conversation.message({
            workspace_id: '56d367c2-4d47-4654-9de9-863733f46053',
            input: params.input,
            context: params.context,
        }, function(err, response) {
            if (err) {
                return reject(err);
            }
            return resolve(response);
        });
    })
}