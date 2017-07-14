import React, { Component } from 'react';
import './App.css';
import Conversation from './Conversation.js';
//import env from './env.js'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: {},
        // A Message Object consists of a message[, intent, date, isUser]
            messageObjectList: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.callWatson("hello");
    }

    callWatson(message) {
        const watsonApiUrl = process.env.REACT_APP_API_URL;
        const watsonApiKey = process.env.REACT_APP_API_KEY;
        const requestJson = JSON.stringify({
            input: {
                text: message
            },
            context: this.state.context
        });
        return fetch(watsonApiUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-IBM-CLIENT-ID': watsonApiKey
                },
                body: requestJson
            }
        ).then((response) => response.json())
        .then((responseJson) => {
            responseJson.date = new Date();
            this.handleResponse(responseJson);
        });
    }

    handleResponse(responseJson) {
        const outputMessage = responseJson.output.text.filter(text => text).join('\n');
        const outputIntent = responseJson.intents[0] ? responseJson.intents[0]["intent"] : "";
        const outputDate = responseJson.date;
        const outputContext = responseJson.context;
        this.setState({
            context: outputContext
        });
        const msgObj = {
            isUser: false,
            intent: outputIntent,
            content: outputMessage,
            date: outputDate
        };
        this.addMessage(msgObj);
    }

    addMessage(msgObj) {
        this.setState({
            messageObjectList: [ ...this.state.messageObjectList , msgObj]
        });
    }

    handleSubmit(e) {
        const inputMessage = e.target.value;
        const inputDate = new Date();
        const msgObj = {
            isUser: true,
            intent: false,
            content: inputMessage,
            date: inputDate
        };
        this.addMessage(msgObj);
        e.target.value = "";
        this.callWatson(inputMessage);
    }

    render() {
        return(
            
            <Conversation submitHandler={this.handleSubmit} messageObjectList={this.state.messageObjectList} 
                appIntro={"API_KEY:["+ process.env.REACT_APP_API_KEY +"]This demo shows how the Conversation service calls the Discovery service when it does not know how to respond. The calls to Conversation and Discovery are made in OpenWhisk, IBM's serverless platform."}/>
        );
    }
}

export default App;