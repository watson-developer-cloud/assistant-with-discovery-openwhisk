# Conversation with Discovery - OpenWhisk

[![Build Status](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk)

This application shows the capabilities of Watson Conversation and Discovery services to work together to find answers on a given query. In this sample app, the user is chatting with a virtual car dashboard, giving it commands in plain English such as "Turn on the wipers," "Play me some music," or "Let's find some food." If the user makes a request and Conversation is not confident in its answer (e.g. "How do I check my tire pressure?"), Discovery will search the car manual and return the most relevant results, if relevant materials exist.

This demo is a reworking of [a previous one](https://github.com/watson-developer-cloud/conversation-with-discovery) but with an OpenWhisk back-end and React front-end. OpenWhisk is IBM's "serverless" offering, allowing users to upload functions to the cloud, call them via REST API, and pay only by the millisecond of usage.

## Table of Contents
* [How it works](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#how-it-works)
* [Requirements](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#requirements)
* [Deploy Automatically to Bluemix](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#deploy-automatically-to-bluemix)
* [Deploy Manually to Bluemix](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#deploy-manually-to-bluemix)
  * [Setting up Conversation and Discovery Services](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#setting-up-conversation-and-discovery-services)
  * [Setting up the OpenWhisk Back-end](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#setting-up-the-openwhisk-back---end)
    * [Configuring the API](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#configuring-the-api)
  * [Setting up the React Front-end](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#setting-up-the-react-front---end)
  * [Running the App](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#running-the-app)
* [Contributing](https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk#contributing)

## Requirements
* IBM Bluemix account. [Sign up](https://console.bluemix.net/?cm_mmc=GitHubReadMe) for Bluemix, or use an existing account.
* Node.js >= 7.9.0

## Deploy Automatically to Bluemix
With just a few steps, you can get this demo application up to the cloud and running in your own Bluemix account.
1. **Ensure your organization has enough quota for one web application using 128MB of memory and 2 services**
2. Click the button below to start the Bluemix DevOps wizard:

[![Deploy to Bluemix](https://bluemix.net/deploy/button_x2.png)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk)

3. Click Tool Integrations. Decide Whether you want to fork/clone the GitHub repository. If you decide to Clone, set a name for your GitHub repository.
4. Click the **Delivery Pipeline** box.
5. Choose a unique name for the application, or keep the one generated.
6. Choose "US South" for your region.
7. Make sure your "organization" and "space" do not contain spaces.
8. Click **Deploy**.
9. Click **Delivery Pipeline** to watch your build. (This may take over ~10 minutes)
10. Return to the Toolchain page once your build completes
11. Click **View App**

## Deploy Manually to Bluemix

### Setting up Conversation and Discovery Services

### Setting up the OpenWhisk Backend
1. Install the Openwhisk [Command Line Interface](https://console.bluemix.net/openwhisk/learn/cli)
2. Add the two actions to OpenWhisk
    
```
    npm run actions
    //which will run a script containing:
    //wsk action create conversation actions/conversation.js --web true
    //wsk action create discovery actions/discovery.js --web true
```

3. Edit [actions/conversationParams.json](actions/conversationParams.json) and [actions/discoveryParams.json](actions/discoveryParams.json) to include your usernames, passwords, environment_id's and collection_id for the Conversation and Discovery services (found in Bluemix).

```json
{
  "username": "<your Conversation service username>",
  "password": "<your Conversation service password>",
  "workspace_id": "<your workspace id for your Conversation demo instance>"
}
```

```json
{
  "username": "<your Discovery service username>",
  "password": "<your Discovery service password>",
  "environment_id": "<your workspace id for your Discovery demo instance>",
  "collection_id": "<your environment id for your Discovery demo instance>"
}
```

4. Use these documents to create default parameters from the command line:

```    
    npm run defaults
    //which will run a script containing the following:
    //wsk action update conversation --param-file action/conversationParams.json
    //wsk action update discovery --param-file action/discoveryParams.json
```

5. Create a sequence using the two actions:

```
    npm run sequence
    //which will run a script containing the following:
    //wsk action create conversation-with-discovery-sequence --sequence conversation,discovery
```
    
#### Configuring the API
1. Navigate to the [API Management](https://console.bluemix.net/openwhisk/apimanagement?env_id=ibm:yp:us-south) page on OpenWhisk.  
![Create new API]( README_pictures/Create_API.png?raw=true )

2. Name your API and supply a base path.  
![Name API and base path]( README_pictures/API_info.png?raw=true )

3. Click "Create operation"  
![Create operation]( README_pictures/Create_operation.png?raw=true )

4. Make a path for your operation, change the HTTP verb to POST, and select your sequence as the action  
![Operation form]( README_pictures/Create_Operation_Form.png?raw=true )

5. Activate the slider next to "Require applications to autheticate via API key"

6. Ensure that the slider next to "Enable CORS so that browser-based applications..." is also activated

7. Click "Save & expose"

8. Navigate to the "Sharing" tab on the left-hand side  
![Sharing tab]( README_pictures/Sharing_tab.png?raw=true )

9. Under "Sharing Outside of Bluemix Organization", click "Create API Key"  
![Create API key]( README_pictures/Create_API_key.png?raw=true )

10. Give your key a name, and copy the API Key to a note  
![Key naming]( README_pictures/Key_naming.png?raw=true )

11. Navigate to the "Summary" tab on the left-hand side

12. Copy the link under "Route" to a note, and add "/submit" or the name of the path associated with your POST action to the end of the URL.  
![Route_link]( README_pictures/Route_link.png?raw=true )

13. Link your API to your React App:  
Copy the text below into a file named `.env` , and save it in the base folder.
```bash
REACT_APP_API_URL: <Your API URL that you saved>
```

### Setting up the React Front-end

### Running the App

## Contributing