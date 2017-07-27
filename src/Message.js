import React from 'react';
import './Message.css';

function Message(props) {



  return(
    <div className={props.position === 'right' ? 'message message--from-right' : 'message message--from-left'}>
      {props.label ? <div className="message__label">{props.label}</div> : false}
      <div className="message__content">{props.message}</div>
      {props.hasTail ? (
        <div className="message__tail">
          <div className="message__tail-background"></div>
          <div className="message__tail-foreground"></div>
        </div>
      ) : false}
      {props.date ? <div className="message__date">{props.date}</div> : false}
    </div>
  );

}

export default Message;