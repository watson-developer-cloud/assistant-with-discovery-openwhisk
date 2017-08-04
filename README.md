# Conversation with Discovery - OpenWhisk

[![Build Status](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk) [![codecov](https://codecov.io/gh/watson-developer-cloud/conversation-with-discovery-openwhisk/branch/master/graph/badge.svg)](https://codecov.io/gh/watson-developer-cloud/conversation-with-discovery-openwhisk)

This application shows the capabilities of Watson Conversation and Discovery services to work together to find answers on a given query. In this sample app, the user is chatting with a virtual car dashboard, giving it commands in plain English such as "Turn on the wipers," "Play me some music," or "Let's find some food." If the user makes a request and Conversation is not confident in its answer (e.g. "How do I check my tire pressure?"), Discovery will search the car manual and return the most relevant results, if relevant materials exist.

This demo is a reworking of [a previous one](https://github.com/watson-developer-cloud/conversation-with-discovery) but with an OpenWhisk back-end and React front-end. OpenWhisk is IBM's "serverless" offering, allowing users to upload functions to the cloud, call them via REST API, and pay only by the millisecond of usage.

## Table of Contents
* [How it Works](#how-it-works)
* [Requirements](#requirements)
* [Deploy Automatically to Bluemix](#deploy-automatically-to-bluemix)
* [Run Locally](#run-locally)
  * [Getting Started](#getting-started)
  * [Setting up Conversation and Discovery Services](#setting-up-conversation-and-discovery-services)
    * [Training Conversation](#training-conversation)
    * [Training Discovery](#training-discovery)
  * [Setting up the OpenWhisk Back-end](#setting-up-the-openwhisk-back-end)
    * [Configuring the API](#configuring-the-api)
  * [Setting up the React Front-end](#setting-up-the-react-front-end)
  * [Running the App](#running-the-app)
* [Contributing](#contributing)

## How it Works

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
> :warning: The 'Deploy to Bluemix' button is meant to be run **once** on your account. If you would like to redeploy the pipeline script, or rebuild the entire app, you should delete your Conversation and Discovery service instances, and the OpenWhisk package that the script creates.

## Run Locally

### Getting Started
1. If you don't already have a Bluemix account, you can sign up [here](https://console.bluemix.net/?cm_mmc=GitHubReadMe)
2. Clone (or fork) this repository, and go to the new directory
```bash
git clone https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk.git
cd conversation-with-discovery-openwhisk
```
3. Download and install the [Cloud-Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html). This will be used to set up your Watson Services in Bluemix.
4. Connect the CLI to Bluemix by running the following:
```bash
cf api https://api.ng.bluemix.net
cf login
```
5. Follow the prompts for logging in to Bluemix. You may have to use single sign-on (SSO).

### Setting up Conversation and Discovery Services
1. Create an instance of Watson Conversation, here named `conversation-for-demo`.
```bash
cf create-service conversation free conversation-for-demo
```
2. Create a service key for your Conversation instance, here called `my-key`.
```bash
cf create-service-key conversation-for-demo my-key
```
3. Retrieve the `username` and `password` for your Conversation instance. Save these in a note.
```bash
cf service-key conversation-for-demo my-key
```
4. Do the same for Discovery. Note the plan name is `lite`.
```bash
cf create-service discovery lite discovery-for-demo
```
> :warning: You may have to wait until Bluemix is done creating your service instance before running the other two commands. Check on the status of your service by running `cf service discovery-for-demo` and checking for a `Status` of `create succeeded`.

Here we called the instance `discovery-for-demo` and the key `my-other-key`. Save the `username` and `password` in a note.
```bash
cf create-service-key discovery-for-demo my-other-key
cf service-key discovery-for-demo my-other-key
```

#### Training Conversation
1. Create a new Conversation workspace using your Conversation username and password (not your Bluemix password) from the previous steps. Make sure you are in the root directory of your repository. Save the `workspace_id` in a note.
```bash
curl -H "Content-Type: application/json" -X POST \
-u <CONVERSATION_USERNAME>:<CONVERSATION_PASSWORD> \
-d "@workspace_blank.json" \
"https://gateway.watsonplatform.net/conversation/api/v1/workspaces?version=2017-05-26"
```
2. Train your workspace with the data provided. Substitute in your Conversation workspace_id.
```bash
curl -H "Content-Type: application/json" -X POST \
-u <CONVERSATION_USERNAME>:<CONVERSATION_PASSWORD> \
-d "@workspace.json" \
"https://gateway.watsonplatform.net/conversation/api/v1/workspaces/<CONVERSATION_WORKSPACE_ID>?version=2017-05-26"
```

#### Training Discovery
1. Create a new Discovery environment by using your Discovery username and password (not your Bluemix credentials or your Conversation credentials). Save the `environment_id` in a note.
```bash
curl -H "Content-Type: application/json" -X POST \
-u <DISCOVERY_USERNAME>:<DISCOVERY_PASSWORD> \
-d '{ "name": "demoEnvironment", "description": "from Conversation with Discovery - OpenWhisk", "size": 0}' \
"https://gateway.watsonplatform.net/discovery/api/v1/environments?version=2017-07-19"
```
2. Get the configuration for your environment. Here, we are just using the default configuration. Substitute your `environment_id` from the last step. Save the `configuration_id` in a note.
```bash
curl -X GET \
-u <DISCOVERY_USERNAME>:<DISCOVERY_PASSWORD> \
"https://gateway.watsonplatform.net/discovery/api/v1/environments/<ENVIRONMENT_ID>/configurations?version=2017-07-19"
```
> Your environment might still be configuring, so wait about a minute before continuing.

3. Create a new collection by using your Discovery username, password, configuration\_id, and environment\_id.
```bash
curl -X POST -H "Content-Type: application/json" \
-u <DISCOVERY_USERNAME>:<DISCOVERY_PASSWORD> \
-d '{ "name": "demoCollection", "description": "from Conversation with Discovery - OpenWhisk", "configuration_id": "<CONFIGURATION_ID>" }" \
"https://gateway.watsonplatform.net/discovery/api/v1/environments/<ENVIRONMENT_ID>/collections?version=2017-07-19"
```
4. From the root directory of your repository, unzip the manual training documents.
```bash
unzip manualdocs.zip
```
5. There are >200 files, so use a for-loop to send them to Watson. Substitute your Discovery username, password, environment\_id, and collection\_id.
```bash
cd manualdocs
for file in *.json
do
  curl -X POST -u <DISCOVERY_USERNAME>:<DISCOVERY_PASSWORD> \
  -F "file=@$file" \
  "https://gateway.watsonplatform.net/discovery/api/v1/environments/<ENVIRONMENT_ID>/collections/<COLLECTION_ID>/documents?version=2017-07-19"
done
```

### Setting up the OpenWhisk Back-end
1. Install the Openwhisk [Command Line Interface](https://console.bluemix.net/openwhisk/learn/cli)
2. Return to the home directory. Add the two actions to OpenWhisk
```bash
    cd ..
    wsk action create conversation actions/conversation.js --web true
    wsk action create discovery actions/discovery.js --web true
```
3. Edit [actions/conversationParams.json](actions/conversationParams.json) and [actions/discoveryParams.json](actions/discoveryParams.json) to include your usernames, passwords, workspace\_id, environment\_id and collection\_id for the Conversation and Discovery services.
```json
{
  "username": "<CONVERSATION_USERNAME>",
  "password": "<CONVERSASTION_PASSWORD",
  "workspace_id": "<WORKSPACE_ID>"
}
```
```json
{
  "username": "<DISCOVERY_USERNAME>",
  "password": "<DISCOVERY_PASSWORD",
  "environment_id": "<ENVIRONMENT_ID>",
  "collection_id": "<COLLECTION_ID"
}
```
4. Use these documents to create default parameters from the command line:
```bash  
    wsk action update conversation --param-file action/conversationParams.json
    wsk action update discovery --param-file action/discoveryParams.json
```
5. Create a sequence using the two actions:
```bash
    wsk action create conversation-with-discovery-sequence --sequence conversation,discovery --web true
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
Create a file named `.env`. Copy the following and paste it into your `.env`, substituting your API URL.
```
REACT_APP_API_URL="<Your API URL>"
```
> We have to add REACT\_APP\_ to the name of the environment variable so React will substitute in the value during the build.

### Setting up the React Front-end
1. In the root directory of your repository, install the project dependencies.
```bash
npm install
```
2. Create an optimized build of your project. During this stage, your environment variable will be inserted into App.js for use by your components.
```bash
npm run build
```

### Running the App
All that's left is to serve your static files locally. You should see the project running in a new tab!
```bash
npm start
```

## Contributing
See [CONTRIBUTING](CONTRIBUTING.md).

## License
This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).
