import React from 'react';
import './Conversation.css';
import { InputWithButton } from 'watson-react-components';

function Conversation(props) {

    function makeMessage(msgObj, index) {
        const formattedTime = msgObj.date.toLocaleTimeString();
        return(
            <div key={index} className={msgObj.isUser ? "message message--from-user" : "message message--from-watson"}>
                {msgObj.intent ? <div className="message__intent">{msgObj.intent}</div> : false}
                <div className="message__content">{msgObj.content}</div>
                {msgObj.date ? <div className="message__date">{formattedTime}</div> : false}
            </div>
        );
    }

    return(
        <div className="conversation">
            <div className="conversation__messages">
                {props.messageObjectList.map(makeMessage)}
            </div>
            <InputWithButton className="conversation__input" onSubmit={props.submitHandler} placeholder="Say something to Watson."/>
        </div>
    );
}

export default Conversation;