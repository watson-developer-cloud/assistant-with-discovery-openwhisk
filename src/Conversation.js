import React, { Component } from 'react';
import './Conversation.css';
import { InputWithButton } from 'watson-react-components';
import Message from './Message.js';
import DiscoveryResult from './DiscoveryResult.js';
import JsonWindow from './JsonWindow.js';
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
                        context: {},
        };
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
        const reqJson = JSON.stringify({
            input: {
                text: message
            },
            context: this.state.context
        });
        this.setState({ reqJson: reqJson });
        return fetch(env.API_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-IBM-CLIENT-ID': env.API_KEY
                },
                body: reqJson
            }
        ).then((response) => response.json())
        .then((responseJson) => {
            this.handleWatsonOutput(responseJson);
        })
    }

    handleWatsonOutput(json) {
        this.setState({
            context: json.context,
            resJson: JSON.stringify(json)
        })
        if (json.output.hasOwnProperty("discoveryResults")) {
            const resultArr = json.output.discoveryResults;
            resultArr.map(function(result) {
                this.addDiscoveryToList(result);
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

    addDiscoveryToList(discoveryResult) {
        this.setState({
            messageList: [ ...this.state.messageList, {result: discoveryResult, source: 'discovery'}]
        });
    }

    render() {
        const messages = this.state.messageList.map(function(msg, index) {
            if (msg.source === 'user') {
                return <Message key={index} isUser={true} text={msg.message} />;
            } else if (msg.source === 'watson') {
                return <Message key={index} isUser={false} text={msg.message} />;
            } else {
                return <DiscoveryResult key={index} result={msg.result} />;
            }
        })
        return (
            <div id="conversation-container">
                <JsonWindow reqJson={this.state.reqJson} resJson={this.state.resJson} />
                <div id="message-container">
                    {messages}
                </div>
                <div id="input-container">
                    <InputWithButton
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