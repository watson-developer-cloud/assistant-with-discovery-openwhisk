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
  * [Setting up the OpenWhisk Back-end](#setting-up-the-openwhisk-back-end)
  * [Setting up the React Front-end](#setting-up-the-react-front-end)
  * [Running the App](#running-the-app)
* [Contributing](#contributing)

## How it Works

![Flow diagram](README_pictures/Flow_diagram.png?raw=true)

Under the hood, there are two components to this app:
* One is the front-end, which is simply static assets (HTML, CSS, and React). I wrote the CSS with Sass for cleaner, more maintainable source code.
* The other is the OpenWhisk actions:
  * When the user inputs text, the UI sends the current context and input to the OpenWhisk sequence. These are processed by the Conversation service and returned, with an output and new context. The results are sent to the next action.
  * The Discovery action checks for a flag from the Conversation output, and if it is present takes the original input and queries the manual with it. If there is no flag, the Conversation results pass through the function unchanged. The Sequence returns the output and updated context back to the UI.


## Requirements
* IBM Bluemix account. [Sign up](https://console.bluemix.net/?cm_mmc=GitHubReadMe) for Bluemix, or use an existing account.
* Node.js >= 4

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
> Make sure you have at least 2 services available in your Bluemix account.
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

1. [Create Watson Services](https://console.bluemix.net/developer/watson/create-project?services=conversation%2Cdiscovery), and copy credentials from Project View page and paste them in `credentials.json` file.

1. Create a .env file in the root directory by copying the sample `.env.example` file using the following command:

``` bash
  cp .env.example .env
```

1. Run following commands to train Conversation and Discovery services:

``` bash
  unzip ./training/manualdocs.zip
  npm run train
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
    wsk action update conversation --param-file actions/conversationParams.json
    wsk action update discovery --param-file actions/discoveryParams.json
```
5. Create a sequence using the two actions:
```bash
    wsk action create conversation-with-discovery-sequence --sequence conversation,discovery --web true
```
6. Retrieve the URL for the action you just created and copy the result:
```bash
    wsk action get conversation-with-discovery-sequence --url
```
7. Link your API to your React App:  
Create a file named `.env`. Copy the following and paste it into your `.env`, substituting your Web Action URL you just retrieved, adding ".json" at the end.
```
REACT_APP_API_URL="<Your Web Action URL>.json"
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
