import React, { Component } from 'react';
import './Conversation.css';
import { InputWithButton } from 'watson-react-components';
import MessageWindow from './MessageWindow.js';
import Message from './Message.js';
import env from './env.js';

class Conversation extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendToWatson = this.sendToWatson.bind(this);
        this.handleWatsonOutput = this.handleWatsonOutput.bind(this);
        this.addMessageToList = this.addMessageToList.bind(this);
        this.state = { messageList: [],
                        text: "",
                        context: {}};
        this.sendToWatson("");
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleSubmit(e) {
        const message = e.target.value;
        this.addMessageToList(message, 'user');
        this.setState({ text: ""});
        e.target.value = "";
        this.sendToWatson(message);
    }

    sendToWatson(message) {
        return fetch(env.API_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-IBM-CLIENT-ID': env.API_SECRET
                },
                body: JSON.stringify({
                    input: {
                        text: message
                    },
                    context: this.state.context
                })
            }
        ).then((response) => response.json())
        .then((responseJson) => {
            this.handleWatsonOutput(responseJson);
        })
    }

    handleWatsonOutput(json) {
        this.setState({
            context: json.context
        })
        if (json.output.hasOwnProperty("discoveryResults")) {
            const resultArr = json.output.discoveryResults;
            resultArr.map(function(result) {
                this.addMessageToList(result.bodySnippet, 'watson');
            }.bind(this));
        } else {
            const text = json.output.text.filter(text => text).join('\n');
            this.addMessageToList(text, 'watson');
        }
        
        console.log(this.state.context);
    }

    addMessageToList(message, source) {
         if (message !== "") {
            this.setState({
                messageList: [ ...this.state.messageList, {message: message, source: source}]
            });
        }
    }

    render() {
        const messages = this.state.messageList.map(function(msg, index) {
            const isUser = (msg.source === 'user') ? true : false;
            return <Message key={index} isUser={isUser} text={msg.message} />;
        })
        return (
            <div id="conversation-container">
                <div>
                    <MessageWindow>
                        {messages}
                    </MessageWindow>
                </div>
                <div id="input-container">
                    <InputWithButton
                        id="user-input"
                        placeholder={"Say something to Watson"}
                        onInput={this.handleChange}
                        onSubmit={this.handleSubmit}
                    />
                </div>
            </div>
        )
    }
}


export default Conversation;