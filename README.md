# Conversation with Discovery - OpenWhisk
Like https://github.com/watson-developer-cloud/conversation-with-discovery but with an OpenWhisk backend.

## Deploy Conversation with Discovery - OpenWhisk Locally

<p>Built with IBM Bluemix. You will need:
<ul><li>an IBM Bluemix account. <a href="https://console.bluemix.net/?cm_mmc=GitHubReadMe">Sign up</a> here.</li>
<li>Node.js</li></ul>
</p>

### Setting up the OpenWhisk Backend
<ol><li>Install the Openwhisk <a href="https://console.bluemix.net/openwhisk/learn/cli">Command Line Interface</a></li>
<li>Add the two actions by running the following commands from your terminal:</li>
    
    wsk action create conversation actions/conversation.js --web true
    wsk action create discovery actions/discovery.js --web true
    
<li>Create a sequence using the two actions:</li>

    wsk action create conversation-with-discovery-sequence --sequence conversation,discovery
    
<li>Create an API that uses your sequence</li>
<ol><li>Navigate to the <a href="https://console.bluemix.net/openwhisk/apimanagement?env_id=ibm:yp:us-south">API Management</a> page on OpenWhisk.</li>

![Create new API]( pictures/Create_API.png?raw=true )

<li>Name your API and supply a base path.</li>

![Name API and base path]( pictures/API_info.png?raw=true )

<li>Click "Create operation"</li>

![Create operation]( pictures/Create_operation.png?raw=true )

<li>Make a path for your operation, change the HTTP verb to POST, and select your sequence as the action</li>

![Operation form]( pictures/Create_Operation_Form.png?raw=true )

<li>Activate the slider next to "Require applications to autheticate via API key"</li>
<li>
