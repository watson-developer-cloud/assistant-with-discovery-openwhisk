#!/bin/bash

###############################################
# Install dependencies
###############################################

echo 'Installing dependencies...'
sudo apt-get -qq update 1>/dev/null
sudo apt-get -qq install unzip 1>/dev/null
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

figlet 'OpenWhisk CLI'
mkdir ~/wsk
curl https://openwhisk.ng.bluemix.net/cli/go/download/linux/amd64/wsk > ~/wsk/wsk
chmod +x ~/wsk/wsk
export PATH=$PATH:~/wsk

################################################
# Create Services
################################################
figlet 'Services'

# Create Conversation service
figlet -f small 'Conversation'
cf create-service conversation free conversation-for-demo
cf create-service-key conversation-for-demo for-demo

set -x
CONVERSATION_CREDENTIALS=`cf service-key conversation-for-demo for-demo | tail -n +2`
export CONVERSATION_USERNAME=`echo $CONVERSATION_CREDENTIALS | jq -r .username`
export CONVERSATION_PASSWORD=`echo $CONVERSATION_CREDENTIALS | jq -r .password`
export CONVERSATION_WORKSPACE_ID=`curl -H "Content-Type: application/json" -X POST \
-u $CONVERSATION_USERNAME:$CONVERSATION_PASSWORD \
-d "@workspace_blank.json" \
"https://gateway-s.watsonplatform.net/conversation/api/v1/workspaces?version=2017-05-26" -v | jq -r .workspace_id`

# Train Conversation Service
curl -H "Content-Type: application/json" \
-X POST -u $CONVERSATION_USERNAME:$CONVERSATION_PASSWORD \
-d @workspace.json "https://gateway-s.watsonplatform.net/conversation/api/v1/workspaces/$CONVERSATION_WORKSPACE_ID?version=2017-05-26" -v

# Create Discovery service
figlet -f small 'Discovery'
cf create-service discovery lite discovery-for-demo
cf create-service-key discovery-for-demo for-demo-2

# Create service credentials
DISCOVERY_CREDENTIALS=`cf service-key discovery-for-demo for-demo-2 | tail -n +2`
export DISCOVERY_USERNAME=`echo $DISCOVERY_CREDENTIALS | jq -r .username`
export DISCOVERY_PASSWORD=`echo $DISCOVERY_CREDENTIALS | jq -r .password`

# Create Discovery environment
export DISCOVERY_ENVIRONMENT_ID=`curl -X POST \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
-H "Content-Type: application/json" \
-d '{ "name": "demoEnvironment", "description": "The environment made for the demo" }' \
"https://gateway-s.watsonplatform.net/discovery/api/v1/environments?version=2016-12-01" -v | jq -r .environment_id`

# Create Discovery collection
export DISCOVERY_COLLECTION_ID=`curl -X POST \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
-H "Content-Type: application/json" \
-d '{ "name": "demoCollection", "description": "The collection made for the demo" }' \
"https://gateway-s.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/collections?version=2016-12-01" | jq -r .collection_id`

# Unzip the car manual documents
unzip manualdocs.zip

# Loop through all documents in manual folder,
MANUAL_FILES=/manualdocs/*
for file in $MANUAL_FILES
do
  curl -X POST \
  -u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
  -H "Content-Type: application/json" \
  -F file="@$file" \
  "https://gateway-s.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/collections/$DISCOVERY_COLLECTION_ID/documents?version=2017-07-19"

# Train Discovery with the manual
curl -X POST \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
-F file=@./.bluemix/manualdocs.zip \
"https://gateway-s.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/collections/$DISCOVERY_COLLECTION_ID/documents?version=2016-12-01"

###############################################
# OpenWhisk Artifacts
###############################################
figlet 'OpenWhisk'

# Retrieve the OpenWhisk authorization key
CF_ACCESS_TOKEN=`cat ~/.cf/config.json | jq -r .AccessToken | awk '{print $2}'`

# Docker image should be set by the pipeline, use a default if not set
if [ -z "$OPENWHISK_API_HOST" ]; then
  echo 'OPENWHISK_API_HOST was not set in the pipeline. Using default value.'
  export OPENWHISK_API_HOST=openwhisk.ng.bluemix.net
fi
OPENWHISK_KEYS=`curl -XPOST -k -d "{ \"accessToken\" : \"$CF_ACCESS_TOKEN\", \"refreshToken\" : \"$CF_ACCESS_TOKEN\" }" \
  -H 'Content-Type:application/json' https://$OPENWHISK_API_HOST/bluemix/v2/authenticate`

SPACE_KEY=`echo $OPENWHISK_KEYS | jq -r '.namespaces[] | select(.name == "'$CF_ORG'_'$CF_SPACE'") | .key'`
SPACE_UUID=`echo $OPENWHISK_KEYS | jq -r '.namespaces[] | select(.name == "'$CF_ORG'_'$CF_SPACE'") | .uuid'`
OPENWHISK_AUTH=$SPACE_UUID:$SPACE_KEY

# Configure the OpenWhisk CLI
wsk property set --apihost $OPENWHISK_API_HOST --auth "${OPENWHISK_AUTH}"

# To enable the creation of API in Bluemix, inject the CF token in the wsk properties
echo "APIGW_ACCESS_TOKEN=${CF_ACCESS_TOKEN}" >> ~/.wskprops

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
wsk action create conversation-with-discovery --sequence /$PACKAGE/converastion,/$PACKAGE/discovery

echo 'Creating OpenWhisk API...'
wsk api create /conversation-with-discovery /submit POST $PACKAGE/conversation-with-discovery --response-type json
API_URL=`wsk api get /conversation-with-discovery -f | jq -r .gwApiUrl`
API_URL+="/submit"
export REACT_APP_API_URL=$API_URL