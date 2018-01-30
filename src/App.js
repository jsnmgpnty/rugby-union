import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { Container } from 'reactstrap';

import { ping } from './services/socketClient';

import './App.css';

import Home from './view/home/home.js'
import gameList from './view/gameList/gameList.js'

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
				  <h1 className="App-title">Enter your name</h1>
				</header>
				<Container>
					<Switch>
						<Route path="/" exact component={Home}/>
						<Route path="/list" exact component={gameList}/>
					</Switch>
				</Container>
			</div>
		);
  }
}

export default App;
