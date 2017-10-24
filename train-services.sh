# Train Conversation Service
curl -H "Content-Type: application/json" \
-X POST -u $CONVERSATION_USERNAME:$CONVERSATION_PASSWORD \
-d @workspace.json "https://gateway.watsonplatform.net/conversation/api/v1/workspaces/$CONVERSATION_WORKSPACE_ID?version=2017-05-26" -v


# Create Discovery environment
export DISCOVERY_ENVIRONMENT_ID=`curl -X POST \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
-H "Content-Type: application/json" \
-d '{ "name": "demoEnvironment", "description": "The environment made for the demo", "size": 0 }' \
"https://gateway.watsonplatform.net/discovery/api/v1/environments?version=2017-07-19" -v | jq -r .environment_id`

# Create Discovery configuration
DISCOVERY_CONFIGURATION_ID=`curl -X GET \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
"https://gateway.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/configurations?version=2017-07-19" -v | jq .configurations | jq .[0] | jq -r .configuration_id`

# Create Discovery collection
export DISCOVERY_COLLECTION_ID=`sleep 60s; curl -X POST \
-u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
-H "Content-Type: application/json" \
-d "{ \"name\": \"demoCollection\", \"description\": \"The collection made for the demo\", \"configuration_id\": \"$DISCOVERY_CONFIGURATION_ID\" }" \
"https://gateway.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/collections?version=2017-07-19" -v | jq -r .collection_id`

# Loop through all documents in manual folder,
MANUAL_FILES="manualdocs/*"
for file in $MANUAL_FILES
do
  #Train Discovery with the manual
  curl -X POST \
  -u $DISCOVERY_USERNAME:$DISCOVERY_PASSWORD \
  -F "file=@$file" \
  "https://gateway.watsonplatform.net/discovery/api/v1/environments/$DISCOVERY_ENVIRONMENT_ID/collections/$DISCOVERY_COLLECTION_ID/documents?version=2017-07-19"
done
