# Conversation with Discovery - OpenWhisk
Like https://github.com/watson-developer-cloud/conversation-with-discovery but with an OpenWhisk backend.

## Deploy Conversation with Discovery - OpenWhisk Locally

<p>Built with IBM Bluemix. You will need:
<ul><li>an IBM Bluemix account. <a href="https://console.bluemix.net/?cm_mmc=GitHubReadMe">Sign up</a> here.</li>
<li>Node.js</li></ul>
</p>

### Setting up the OpenWhisk Backend
<ol><li>Install the Openwhisk <a href="https://console.bluemix.net/openwhisk/learn/cli">Command Line Interface</a></li>
<li>Add the two actions to OpenWhisk</li>
    
    npm run actions
    //which will run a script containing:
    //wsk action create conversation actions/conversation.js --web true
    //wsk action create discovery actions/discovery.js --web true

<li>Edit <a href="actions/conversationParams.json">actions/conversationParams.json</a> and <a href="actions/discoveryParams.json">actions/discoveryParams.json</a> to include your usernames, passwords, environment_id's and collection_id for the Conversation and Discovery services (found in Bluemix).</li>

```javascript
{
  "username": "<your Conversation service username>",
  "password": "<your Conversation service password>",
  "workspace_id": "<your workspace id for your Conversation demo instance>"
}
```

```javascript
{
  "username": "<your Discovery service username>",
  "password": "<your Discovery service password>",
  "workspace_id": "<your workspace id for your Discovery demo instance>",
  "collection_id": "<your environment id for your Discovery demo instance>"
}
```

<li>Use these documents to create default parameters from the command line: </li>

    
    npm run defaults
    //which will run a script containing the following:
    //wsk action update conversation --param-file action/conversationParams.json
    //wsk action update discovery --param-file action/discoveryParams.json

<li>Create a sequence using the two actions:</li>

    npm run sequence
    //which will run a script containing the following:
    //wsk action create conversation-with-discovery-sequence --sequence conversation,discovery
    
<li>Create an API that uses your sequence</li>
<ol><li>Navigate to the <a href="https://console.bluemix.net/openwhisk/apimanagement?env_id=ibm:yp:us-south">API Management</a> page on OpenWhisk.</li>

![Create new API]( README_pictures/Create_API.png?raw=true )

<li>Name your API and supply a base path.</li>

![Name API and base path]( README_pictures/API_info.png?raw=true )

<li>Click "Create operation"</li>

![Create operation]( README_pictures/Create_operation.png?raw=true )

<li>Make a path for your operation, change the HTTP verb to POST, and select your sequence as the action</li>

![Operation form]( README_pictures/Create_Operation_Form.png?raw=true )

<li>Activate the slider next to "Require applications to autheticate via API key"</li>
<li>Ensure that the slider next to "Enable CORS so that browser-based applications..." is also activated</li>
<li>Click "Save & expose"</li>
<li>Navigate to the "Sharing" tab on the left-hand side</li>

![Sharing tab]( README_pictures/Sharing_tab.png?raw=true )

<li>Under "Sharing Outside of Bluemix Organization", click "Create API Key"</li>

![Create API key]( README_pictures/Create_API_key.png?raw=true )

<li>Give your key a name, and copy the API Key to a note</li>

![Key naming]( README_pictures/Key_naming.png?raw=true )
