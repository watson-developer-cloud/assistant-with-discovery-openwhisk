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
                    'Accept': 'application/json'
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
        const outputDate = responseJson.date.toLocaleTimeString();
        const outputContext = responseJson.context;
        this.setState({
            context: outputContext
        });
        const msgObj = {
            position: "left",
            label: outputIntent,
            message: outputMessage,
            date: outputDate,
            hasTail: true
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
        const formattedDate = inputDate.toLocaleTimeString();
        const msgObj = {
            position: "right",
            message: inputMessage,
            date: formattedDate,
            hasTail: true
        };
        this.addMessage(msgObj);
        e.target.value = "";
        this.callWatson(inputMessage);
    }

    render() {
        return(
            <div className="app-wrapper">
                <p className="conversation__intro">
                    This demo shows how the Conversation service calls the Discovery service when it does not know how to respond. The calls to Conversation and Discovery are made in OpenWhisk, IBM's serverless platform.
                </p>
                <Conversation
                    onSubmit={this.handleSubmit}
                    messageObjectList={this.state.messageObjectList}
                />
            </div>
        );
    }
}

export default App;