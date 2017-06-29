import React from 'react';
import { Code } from 'watson-react-components';
import './JsonWindow.css';

const JsonWindow = ({ reqJson, resJson }) => {
    
    reqJson = reqJson || "";
    resJson = resJson || "";
    
    function formatJson(aJson) {
        const withoutTabs = aJson.replace(/{/g, "{\n").replace(/}/g, "\n}").replace(/\[/g, "[\n").replace(/\]/g, "\n]").replace(/,/g, ",\n").replace(/:/g, ": ");
        var retArr = [];
        var writeIndex = 0;
        var tabs = 0;
        
        for (var readIndex = 0; readIndex < withoutTabs.length; readIndex++) {
            if (withoutTabs[readIndex] === "\n") {
                retArr[writeIndex] = withoutTabs[readIndex];
                writeIndex++;
                if (withoutTabs[readIndex+1] === "}" || withoutTabs[readIndex+1] === "]") {
                    tabs--;
                }
                for ( var i = 0; i < tabs; i++) {
                        retArr[writeIndex] = "\t";
                        writeIndex++;
                }
            } else {
                if (withoutTabs[readIndex] === "{" || withoutTabs[readIndex] === "[") {
                    tabs++;
                }
                retArr[writeIndex] = withoutTabs[readIndex];
                writeIndex++;
            }
        }
        return retArr.join("");
    }


    return (
        <div id="json-window-container">
            {reqJson ? <b>Sent to Watson:</b> : false}
            {reqJson ? <Code language="json">{formatJson(reqJson)}</Code> : false}
            <b>Watson Understands:</b>
            <Code language="javascript">{formatJson(resJson)}</Code>
        </div>
    )
}

export default JsonWindow;