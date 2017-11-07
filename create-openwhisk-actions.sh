source .env; 

# Retrieve credentials from file
CONVERSATION_USERNAME=`jq .conversation[].credentials.username credentials.json`;
CONVERSATION_PASSWORD=`jq .conversation[].credentials.password credentials.json`;
DISCOVERY_USERNAME=`jq .discovery[].credentials.username credentials.json`;
DISCOVERY_PASSWORD=`jq .discovery[].credentials.password credentials.json`;

# Create OpenWhisk Actions
echo 'Creating OpenWhisk Actions...'
export PACKAGE="conversation-with-discovery-openwhisk"
bx wsk package create conversation-with-discovery-openwhisk
bx wsk action create $PACKAGE/conversation actions/conversation.js --web true
bx wsk  action create $PACKAGE/discovery actions/discovery.js --web true

echo 'Setting default parameters...'
bx wsk  action update $PACKAGE/conversation --param username $CONVERSATION_USERNAME --param password $CONVERSATION_PASSWORD --param workspace_id $WORKSPACE_ID
bx wsk action update $PACKAGE/discovery --param username $DISCOVERY_USERNAME --param password $DISCOVERY_PASSWORD --param environment_id $ENVIRONMENT_ID --param collection_id $COLLECTION_ID

echo 'Creating OpenWhisk Sequence...'
bx wsk  action create $PACKAGE/conversation-with-discovery-sequence --sequence $PACKAGE/conversation,$PACKAGE/discovery --web true

echo 'Retrieving OpenWhisk WebAction URL...'
API_URL=`bx wsk action get $PACKAGE/conversation-with-discovery-sequence --url | sed -n '2p'`;
API_URL+=".json"

# Write API Url to .env file
head -n 4 .env | cat >> .env_tmp; mv .env_tmp .env
echo "REACT_APP_API_URL=$API_URL" >> .env