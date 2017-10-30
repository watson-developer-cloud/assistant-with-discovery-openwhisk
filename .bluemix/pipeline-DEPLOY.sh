#!/bin/bash

mkdir ~/wsk
curl https://openwhisk.ng.bluemix.net/cli/go/download/linux/amd64/wsk > ~/wsk/wsk
chmod +x ~/wsk/wsk
export PATH=$PATH:~/wsk


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
wsk property set --apihost $OPENWHISK_API_HOST --auth $OPENWHISK_AUTH

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
wsk action create $PACKAGE/conversation-with-discovery --sequence $PACKAGE/conversation,$PACKAGE/discovery --web true

echo 'Creating OpenWhisk API...'
wsk api create /conversation-with-discovery /submit POST $PACKAGE/conversation-with-discovery --response-type json
API_URL=`wsk api get /conversation-with-discovery -f | jq -r .gwApiUrl`
API_URL+="/submit"
export REACT_APP_API_URL=$API_URL

touch .env
echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env
