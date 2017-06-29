import React from 'react';
import PropTypes from 'prop-types';
import './DiscoveryResult.css';

const DiscoveryResult = ({ result }) => {
    const body = result.body;
    const sourceUrl = result.sourceUrl;
    const bodySnippet = result.bodySnippet;
    const title = result.title;

    return (
        <div className="discovery-result">
            <b className="discovery-title">{title}</b>
            <br />
            <p className="discovery-body">{bodySnippet}</p>
        </div>
    );
}

export default DiscoveryResult;