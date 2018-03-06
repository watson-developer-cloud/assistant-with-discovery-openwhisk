import React from 'react';
import './DiscoveryResult.css';

function DiscoveryResult(props) {
  const result = props.result;
  return (
    <div className="result">
      <div className="result__title">{result.name}</div>
      <div className="result__link"><a href={result.url} target="_blank">{'View details on Amazon'}</a></div>
    </div>
  );
}

export default DiscoveryResult;
