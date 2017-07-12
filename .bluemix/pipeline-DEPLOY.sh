#!/bin/bash

###############################################
# Install dependencies
###############################################

echo 'Installing dependencies...'
sudo apt-get -qq update 1>/dev/null
sudo apt-get -qq install jq 1>/dev/null
sudo apt-get -qq install figlet 1>/dev/null

figlet 'Node.js'

echo 'Installing nvm (Node.js Version Manager)...'
npm config delete prefix
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash > /dev/null 2>&1
. ~/.nvm/nvm.sh

echo 'Installing Node.js 7.9.0...'
nvm install 7.9.0 1>/dev/null
npm install --progress false --loglevel error 1>/dev/null

################################################
# Create Services
################################################
figlet 'Services'

# Create Conversation service
figlet -f small 'Conversation'
cf create-service conversation free conversation-for-demo
cf create-service-key conversation-for-demo for-demo

CONVERSATION_CREDENTIALS=`cf service-key converstaion-for-demo for-demo | tail -n +2`
export CONVERSATION_USERNAME=`echo $CONVERSATION_CREDENTIALS | jq -r .username`
export CONVERSATION_PASSWORD=`echo $CONVERSATION_CREDENTIALS | jq -r .password`
CONVERSATION_WORKSPACE=`cat workspace.json`
CONVERSATION_WORKSPACE_INTENTS=`echo $CONVERSATION_WORKSPACE | jq -r .intents`
CONVERSATION_WORKSPACE_ENTITIES=`echo $CONVERSATION_WORKSPACE | jq -r .entities`
CONVERSATION_WORKSPACE_DIALOG_NODES=`echo $CONVERSATION_WORKSPACE | jq -r .dialog_nodes`
export CONVERSATION_workspaceId=`curl -H "Content-Type: application/json" -X POST \
-u $CONVERSATION_USERNAME:$CONVERSATION_PASSWORD \
-d "{\"name\":\"Sample\",\"intents\":$CONVERSATION_WORKSPACE_INTENTS,\"entities\":$CONVERSATION_WORKSPACE_ENTITIES,\"language\":\"en\",\"description\"The sample car training for the demo\",\"dialog_nodes\":$CONVERSATION_WORKSPACE_DIALOG_NODES}" "https://gateway.watsonplatform.net/conversation/api/v1/workspaces?version=2017-05-26"`
