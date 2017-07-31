const action = require('../../actions/discovery');
const assert = require('assert');
const nock = require('nock');

const environment_id = 'fake-id';
const collection_id = 'fake-id';

describe('[action] Discovery', function() {

    beforeEach(function() {
        nock('https://gateway.watsonplatform.net:443')
            .get(`/discovery/api/v1/environments/${environment_id}/collections/${collection_id}/query`)
            .query({
                'version': '2016-12-01'
            })
            .reply(200, {
                results: [
                    {
                        contentHtml: "test content",
                        score: "42",
                        id: "24601",
                        sourceUrl: "ibm.com",
                        title: "Hello, world!"
                    }
                ]
            });
    });

    it('should throw error if credentials are missing', function() {
        const params = {
            input: 'fake input',
            context: {},
            environment_id: environment_id,
            collection_id: collection_id
        };
        return action.main(params).then(function() {
            assert.fail('Missing credentials error was not found');
        }).catch(function(error) {
            assert(error.message === 'params.username cannot be null');
        });
    });

    it('should call Discovery when the parameters are right', function() {
        const params = {
            input: 'fake input',
            context: {},
            output: {"action": {"call_discovery": ""}},
            username: 'foo',
            password: 'bar',
            environment_id: environment_id,
            collection_id: collection_id
        };
        return action.main(params).then(function() {
            assert(true);
        }).catch(assert.ifError);
    })
});