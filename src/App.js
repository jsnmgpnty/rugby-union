import React, { Component } from 'react';
import logo from './logo.svg';

import { ping } from './services/socketClient';

import './App.css';

class App extends Component {
  state = {
    isConnectedToSocketServer: false,
  };

  constructor(props) {
    super(props);

    ping((data) => {
      this.setState({ isConnectedToSocketServer: data.message === 'pong' });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {
          this.state.isConnectedToSocketServer ?
          <small>Connected</small> :
          <small>Not connected</small>
        }
      </div>
    );
  }
}

export default App;
