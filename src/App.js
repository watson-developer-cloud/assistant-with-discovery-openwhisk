import React, { Component } from 'react';
import AudioRecorder from 'react-audio-recorder';
import './App.css';
import Conversation from './Conversation.js';
import DiscoveryResult from './DiscoveryResult.js';
const TEXT_TO_SPEECH_URL = 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/nicole.nikoru.liu.chen%40gmail.com_dev/actions/Bluemix_text-to-speech-cs89_text-to-speech-cs89-chat-text-to-sp-1517884259798/textToSpeech?blocking=true&result=true';
const SPEECH_TO_TEXT_URL = 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/nicole.nikoru.liu.chen%40gmail.com_dev/actions/Bluemix_speech-to-text-cs89_speech-to-text-gsakl-speech-to--1517882863030/speechToText?blocking=true&result=true';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      context: {},
      // A Message Object consists of a message[, intent, date, isUser]
      messageObjectList: [],
      discoveryNumber: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.callWatson('hello');
    this.getSpeech = this.getSpeech.bind(this);
    this.onAudioChange = this.onAudioChange.bind(this);
    // this.transcribe = this.transcribe.bind(this);
    this.getData = this.getData.bind(this);
  }
  //
  // transcribe(audioFile) {
  //   console.log(audioFile);
  //   return fetch(SPEECH_TO_TEXT_URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'Authorization': 'Basic MDJmMTJmNDQtN2YwNy00NDlmLTgwOTYtZWMyYzU4ZjA1NTE5OjU3d0tvdUI2d0k3c0NrczFGR1JZSWxMb1pVUHJFR29rS3ZPZHdzNzREem4zWFBEbmhJRnNKWmZBanFDOFVWVUw='
  //     },
  //     body: JSON.stringify({
  //       content_type: 'audio/wav',
  //       encoding: 'base64',
  //       payload: audioFile
  //     })
  //   }).then(response=>{
  //     console.log(response);
  //   })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }

  getData(audioFile) {
    // var reader = new FileReader();
    // reader.onload = function(event) {
    //   var data = event.target.result.split(',')
    //     , decodedImageData = btoa(data[1]);                    // the actual conversion of data from binary to base64 format
    //   callback(decodedImageData);
    // };
    // reader.readAsDataURL(audioFile);
    // const transcribe = this.transcribe;
    var reader = new FileReader();
    reader.readAsDataURL(audioFile);
    reader.onloadend = function() {
      // console.log(reader.result);
      const base64 = reader.result.substring(reader.result.indexOf(',')+1);
      // console.log(base64);
      // console.log(base64);
      return fetch(SPEECH_TO_TEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Basic MDJmMTJmNDQtN2YwNy00NDlmLTgwOTYtZWMyYzU4ZjA1NTE5OjU3d0tvdUI2d0k3c0NrczFGR1JZSWxMb1pVUHJFR29rS3ZPZHdzNzREem4zWFBEbmhJRnNKWmZBanFDOFVWVUw='
        },
        body: JSON.stringify({
          content_type: 'audio/wav',
          encoding: 'base64',
          payload: base64
        })
      }).then(response=>{
        console.log(response);
        return response.json().then(responseJson => {
          console.log(responseJson);
        });
      })
        .catch(err => {
          console.log(err);
        });
    };
  }

  onAudioChange(blob) {
    console.log(blob);
    // const transcribe = this.transcribe;
    // var reader = new FileReader();
    // reader.readAsDataURL(blob.audioData);
    // reader.onloadend = function() {
    //   console.log(reader.result);
    //   transcribe(blob.audioData);
    // };
    this.getData(blob.audioData);
  }

  getSpeech(msgObj) {
    console.log(msgObj);
    return fetch(TEXT_TO_SPEECH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic MDJmMTJmNDQtN2YwNy00NDlmLTgwOTYtZWMyYzU4ZjA1NTE5OjU3d0tvdUI2d0k3c0NrczFGR1JZSWxMb1pVUHJFR29rS3ZPZHdzNzREem4zWFBEbmhJRnNKWmZBanFDOFVWVUw='
      },
      body: JSON.stringify({
        payload: msgObj.message,
        accept: 'audio/wav',
        encoding: 'base64'
      })

    })
      .then(response => {
        return response.json().then(data => {
          console.log(data);
          const speech = new Audio(`data:audio/wav;base64, ${data.payload}`);
          speech.play();
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  callWatson(message) {
    const watsonApiUrl = process.env.REACT_APP_API_URL;
    const requestJson = JSON.stringify({
      input: {
        text: message
      },
      context: this.state.context
    });
    return fetch(watsonApiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestJson
      }
    ).then((response) => {
      if(!response.ok) {
        throw response;
      }
      return(response.json());
    })
      .then((responseJson) => {
        responseJson.date = new Date();
        this.handleResponse(responseJson);
      }).catch(function(error) {
        throw error;
      });
  }

  handleResponse(responseJson) {
    if(responseJson.hasOwnProperty('output') && responseJson.output.hasOwnProperty('action') && responseJson.output.action.hasOwnProperty('call_discovery')) {
      this.addMessage( { label: 'Discovery Result:', message: responseJson.output.text[0], date: (new Date()).toLocaleTimeString(), position: 'left'});
      this.formatDiscovery(responseJson.output.discoveryResults);

    } else {
      const outputMessage = responseJson.output.text.filter(text => text).join('\n');
      const outputIntent = responseJson.intents[0] ? responseJson.intents[0]['intent'] : '';
      const outputDate = responseJson.date.toLocaleTimeString();
      const outputContext = responseJson.context;
      this.setState({
        context: outputContext
      });
      const msgObj = {
        position: 'left',
        label: outputIntent,
        message: outputMessage,
        date: outputDate,
        hasTail: true
      };
      this.addMessage(msgObj);
    }
  }

  addMessage(msgObj) {
    console.log(msgObj);
    this.setState({
      messageObjectList: [ ...this.state.messageObjectList , msgObj]
    }, ()=> {
      // if (msgObj.position === 'left') {this.getSpeech(msgObj);}
    });
  }

  handleSubmit(e) {
    const inputMessage = e.target.value;
    const inputDate = new Date();
    const formattedDate = inputDate.toLocaleTimeString();
    const msgObj = {
      position: 'right',
      message: inputMessage,
      date: formattedDate,
      hasTail: true
    };
    this.addMessage(msgObj);
    e.target.value = '';
    this.callWatson(inputMessage);
  }

  formatDiscovery(resultArr) {
    resultArr.map(function(result, index) {
      const formattedResult = <DiscoveryResult key={'d' + this.state.discoveryNumber + index} result={result} linkText={'See full manual entry'} />;
      this.addMessage({ message: formattedResult });
    }.bind(this));

    this.setState({
      discoveryNumber: this.state.discoveryNumber + 1
    });
    return(true);
  }

  scrollToBottom() {
    const element = document.getElementsByClassName('conversation__messages')[0];
    element.scrollTop = element.scrollHeight;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }


  render() {
    return(
      <div className="app-wrapper">
        <h1 className="conversation__intro">
                    ReviewInsights
        </h1>
        <Conversation
          onSubmit={this.handleSubmit}
          messageObjectList={this.state.messageObjectList}
        />
        <AudioRecorder onChange={this.onAudioChange}/>
      </div>
    );
  }
}

export default App;
