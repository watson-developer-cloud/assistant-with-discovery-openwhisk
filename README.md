# Conversation with Discovery - OpenWhisk

[![Build Status](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/conversation-with-discovery-openwhisk) [![codecov](https://codecov.io/gh/watson-developer-cloud/conversation-with-discovery-openwhisk/branch/master/graph/badge.svg)](https://codecov.io/gh/watson-developer-cloud/conversation-with-discovery-openwhisk)

This application shows the capabilities of Watson Conversation and Discovery services to work together to find answers on a given query. In this sample app, the user is chatting with a virtual car dashboard, giving it commands in plain English such as "Turn on the wipers," "Play me some music," or "Let's find some food." If the user makes a request and Conversation is not confident in its answer (e.g. "How do I check my tire pressure?"), Discovery will search the car manual and return the most relevant results, if relevant materials exist.

This demo is a reworking of [a previous one](https://github.com/watson-developer-cloud/conversation-with-discovery) but with an OpenWhisk back-end and React front-end. OpenWhisk is IBM's "serverless" offering, allowing users to upload functions to the cloud, call them via REST API, and pay only by the millisecond of usage.

## Table of Contents
* [How it Works](#how-it-works)
* [Run Locally](#run-locally)
  * [Getting Started](#getting-started)
  * [Setting up Watson Services](#setting-up-watson-services)
  * [Train Watson Services](#train-watson-services)
  * [Setting up the OpenWhisk Back-end](#setting-up-the-openwhisk-back-end)
  * [Setting up the React Front-end](#setting-up-the-react-front-end)
  * [Running the App](#running-the-app)
* [License](#license)

## How it Works

![Flow diagram](README_pictures/Flow_diagram.png?raw=true)

Under the hood, there are two components to this app:
* One is the front-end, which is simply static assets (HTML, CSS, and React), it uses CSS with Sass for cleaner, more maintainable source code.
* The other is the OpenWhisk actions:
  * When the user inputs text, the UI sends the current context and input to the OpenWhisk sequence. These are processed by the Conversation service and returned, with an output and new context. The results are sent to the next action.
  * The Discovery action checks for a flag from the Conversation output, and if it is present takes the original input and queries the manual with it. If there is no flag, the Conversation results pass through the function unchanged. The Sequence returns the output and updated context back to the UI.


## Run Locally

### Getting Started
1. If you don't already have an IBM Cloud account, you can sign up [here](https://console.bluemix.net/?cm_mmc=GitHubReadMe)
> Make sure you have at least 2 services available in your IBM Cloud account.

2. Clone (or fork) this repository, and go to the new directory
```bash
git clone https://github.com/watson-developer-cloud/conversation-with-discovery-openwhisk.git
cd conversation-with-discovery-openwhisk
```

3. Install [Node.js](https://nodejs.org) (Versions >= 6).

4. In the root directory of your repository, install the project dependencies.
```bash
npm install
```

### Setting up Watson Services
> Skip this section if you have downloaded the project from [Watson Console](https://console.ng.bluemix.net/developer/watson) and already have a `credentials.json` file

1. [Create  a project](https://console.bluemix.net/developer/watson/create-project?services=conversation%2Cdiscovery) using the Watson Console using Conversation and Discovery services.

2. In the Watson Console navigate to [Projects](https://console.bluemix.net/developer/watson/projects), click your newly created project, copy credentials from Project View page and paste them in to a new `credentials.json` file.

### Train Watson Services
Run following commands to train Conversation and Discovery services:
``` bash
  npm run train
```

### Setting up the OpenWhisk Back-end
1. Install the Openwhisk [Command Line Interface](https://console.bluemix.net/openwhisk/learn/cli).

2. Download and install the [Bluemix CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html).

3. Login by running the following:

```bash
bx login
```

4. Install [jq](https://stedolan.github.io/jq/download/) as a dependency.

5. Run the provided shell script `create-openwhisk-actions.sh` to create your OpenWhisk actions & sequence. The syntax to do so may vary by system, but for example:

```bash
   sh create-openwhisk-actions.sh
```

### Setting up the React Front-end
Create an optimized build of your project. During this stage, your environment variable will be inserted into App.js for use by your components.
```bash
npm run build
```

### Running the App
All that's left is to serve your static files locally. You should see the project running in a new tab!
```bash
npm start
```

## License
Licensed under [Apache 2.0](LICENSE).
