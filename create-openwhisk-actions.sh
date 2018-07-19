source ./.env;

# Retrieve credentials from file
ASSISTANT_IAM_APIKEY=`jq .conversation[].credentials.apikey credentials.json`;
ASSISTANT_URL=`jq .conversation[].credentials.url credentials.json`;
ASSISTANT_USERNAME=`jq .conversation[].credentials.username credentials.json`;
ASSISTANT_PASSWORD=`jq .conversation[].credentials.password credentials.json`;
DISCOVERY_IAM_APIKEY=`jq .discovery[].credentials.apikey credentials.json`;
DISCOVERY_URL=`jq .discovery[].credentials.url credentials.json`;
DISCOVERY_USERNAME=`jq .discovery[].credentials.username credentials.json`;
DISCOVERY_PASSWORD=`jq .discovery[].credentials.password credentials.json`;

# Create OpenWhisk Actions
echo 'Creating OpenWhisk Actions...'
export PACKAGE="assistant-with-discovery-openwhisk"
ibmcloud wsk package create assistant-with-discovery-openwhisk
ibmcloud wsk action create $PACKAGE/conversation actions/conversation.js --web true --kind nodejs:8
ibmcloud wsk action create $PACKAGE/discovery actions/discovery.js --web true --kind nodejs:8

echo 'Setting default parameters...'
ibmcloud wsk action update $PACKAGE/conversation --param username $ASSISTANT_USERNAME --param password $ASSISTANT_PASSWORD  --param iam_apikey $ASSISTANT_IAM_APIKEY --param url $ASSISTANT_URL --param workspace_id $WORKSPACE_ID
ibmcloud wsk action update $PACKAGE/discovery --param username $DISCOVERY_USERNAME --param password $DISCOVERY_PASSWORD --param iam_apikey $DISCOVERY_IAM_APIKEY --param url $DISCOVERY_URL --param environment_id $ENVIRONMENT_ID --param collection_id $COLLECTION_ID

echo 'Creating OpenWhisk Sequence...'
ibmcloud wsk  action create $PACKAGE/assistant-with-discovery-sequence --sequence $PACKAGE/conversation,$PACKAGE/discovery --web true

echo 'Retrieving OpenWhisk WebAction URL...'
API_URL=`ibmcloud wsk action get $PACKAGE/assistant-with-discovery-sequence --url | sed -n '2p'`;
API_URL+=".json"

# Write API Url to .env file
head -n 4 .env | cat >> .env_tmp; mv .env_tmp .env
echo "REACT_APP_API_URL=$API_URL" >> .env
