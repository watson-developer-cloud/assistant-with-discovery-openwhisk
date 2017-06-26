import React, { Component } from 'react';
import './App.css';
import { Header, Footer, Jumbotron } from 'watson-react-components';
import Conversation from './Conversation.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header 
          mainBreadcrumbs="Conversation"
          mainBreadcrumbsUrl="#"
          hasWordmark={false}
        />
        <Jumbotron 
          serviceName="Conversation with Discovery (using OpenWhisk)"
          description="A demo of the Conversation and Discovery services using OpenWhisk as a backend"
        />
        <div id="conversation-container">
          <Conversation />
        </div>
        <div id="footer-container">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
