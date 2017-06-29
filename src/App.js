import React, { Component } from 'react';
import './App.css';
import { Footer } from 'watson-react-components';
import Conversation from './Conversation.js'

class App extends Component {
  render() {
    return (
      <div id="App">
        <h1 id="header">Conversation with Discovery - Using OpenWhisk</h1>
        <Conversation />
        <div id="footer-container">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
