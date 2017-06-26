import React, { Component } from 'react';
import './MessageWindow.css';

class MessageWindow extends Component {
    render() {
        return(
            <div id="message-window">
                {this.props.children}
            </div>
        );
    }
}

export default MessageWindow;