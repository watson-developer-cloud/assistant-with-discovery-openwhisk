#!/bin/bash

###############################################
# Install dependencies
###############################################

echo 'Installing dependencies...'
sudo apt-get -qq update 1>/dev/null
sudo apt-get -qq install jq 1>/dev/null

echo 'Installing nvm (Node.js Version Manager)...'
npm config delete prefix
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash > /dev/null 2>&1
. ~/.nvm/nvm.sh

echo 'Installing Node.js 7.9.0...'
nvm install 7.9.0 1>/dev/null
npm install --progress false --loglevel error 1>/dev/null

echo 'Installing OpenWhisk CLI...'
mkdir ~/wsk
curl https://openwhisk.ng.bluemix.net/cli/go/download/linux/amd64/wsk > ~/wsk/wsk
chmod +x ~/wsk/wsk
export PATH=$PATH:~/wsk

################################################
# Train Services
################################################

cp .env.example .env

# Retrieve Conversation Credentials
export CONVERSATION_USERNAME=`jq .conversation[].credentials.username credentials.json`
export CONVERSATION_PASSWORD=`jq .conversation[].credentials.password credentials.json`

# Retrieve Discovery Credentials
export DISCOVERY_USERNAME=`jq .discovery[].credentials.username credentials.json`
export DISCOVERY_PASSWORD=`jq .discovery[].credentials.password credentials.json`

echo 'Unzipping training documents...'
unzip ./training/manualdocs.zip
echo 'Training services...'
npm run train


###############################################
# OpenWhisk Artifacts
###############################################

# Create OpenWhisk Actions
echo 'Creating OpenWhisk Actions...'
export PACKAGE="conversation-with-discovery-openwhisk"
wsk package create conversation-with-discovery-openwhisk
wsk action create $PACKAGE/conversation actions/conversation.js --web true
wsk action create $PACKAGE/discovery actions/discovery.js --web true

echo 'Setting default parameters...'
wsk action update $PACKAGE/conversation --param username $CONVERSATION_USERNAME --param password $CONVERSATION_PASSWORD --param workspace_id $CONVERSATION_WORKSPACE_ID
wsk action update $PACKAGE/discovery --param username $DISCOVERY_USERNAME --param password $DISCOVERY_PASSWORD --param environment_id $DISCOVERY_ENVIRONMENT_ID --param collection_id $DISCOVERY_COLLECTION_ID

echo 'Creating OpenWhisk Sequence...'
wsk action create $PACKAGE/conversation-with-discovery-sequence --sequence $PACKAGE/conversation,$PACKAGE/discovery --web true

echo 'Connecting OpenWhisk WebAction...'
API_URL=`bx wsk action get $PACKAGE/conversation-with-discovery-sequence --url | sed -n '2p'`;
API_URL+=".json"
export REACT_APP_API_URL=$API_URL

# Write API Url to .env file
head -n 4 .env | cat >> .env_tmp; mv .env_tmp .env
echo "REACT_APP_API_URL=$API_URL" >> .env
