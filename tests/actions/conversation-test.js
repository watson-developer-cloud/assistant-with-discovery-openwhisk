const action = require('../../actions/conversation');
const assert = require('assert');
const nock = require('nock');

const workspace_id = 'fake-id';

describe('[action] Conversation', function() {
    
  beforeEach(function() {
    nock('https://gateway.watsonplatform.net:443')
      .post(`/conversation/api/v1/workspaces/${workspace_id}/message`)
      .query({
        'version': '2017-05-26'
      })
      .reply(200, {
        'fake-key': 'fake-value'
      });
  });

  it('should throw error if credentials are missing', function() {
    const params = {
      input: 'fake input',
      context: {},
      workspace_id: workspace_id
    };
    return action.main(params).then(function() {
      assert.fail('Missing credentials error was not found');
    }).catch(function(error) {
      assert(error.message === 'params.username cannot be null');
    });
  });

  it('should call Conversation when the parameters are right', function() {
    const params = {
      input: 'fake input',
      context: {},
      username: 'foo',
      password: 'bar',
      workspace_id: workspace_id
    };
    return action.main(params).then(function() {
      assert(true);
    }).catch(assert.ifError);
  });
});