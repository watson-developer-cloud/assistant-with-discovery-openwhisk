import React from 'react';
import './DiscoveryResult.css';

function DiscoveryResult(props) {

  return (
    <div className="result">
      <div className="result__title">{props.title}</div>
      <div className="result__preview">{props.preview}</div>
      <div className="result__link"><a href={props.link} target="_blank">{props.linkText}</a></div>
    </div>
  );
}

export default DiscoveryResult;