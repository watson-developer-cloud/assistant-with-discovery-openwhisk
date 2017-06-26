import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';
import { Colors } from 'watson-react-components';

const Message =({ isUser, text }) => 
    <div className={`message ${isUser ? 'from-user' : 'from-watson'}`}>
        <div className="message-inner">
            <p style={isUser ? {"background-color": Colors.purple_40} : {}}>{text}</p>
        </div>
    </div>


Message.propTypes = {
    isUser: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
}

export default Message;