import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import VotingDemo from './voting/VotingDemo';

import { setCountries } from 'actions/countries';
import { ping } from 'services/socketClient';
import { Home, GameList, GameLobby } from 'view';

import './App.css';

const mapDispatchToProps = dispatch => ({
  setCountries: countries => dispatch(setCountries(countries)),
});

class App extends Component {
	static propTypes = {
		setCountries: PropTypes.func.isRequired,
	};

	state = {
		isConnectedToSocketServer: false,
	};

	constructor(props) {
		super(props);

		ping((data) => {
			this.setState({ isConnectedToSocketServer: data.message === 'pong' });
		});
  }

  async componentDidMount() {
    await this.getCountries();
  }

	async getCountries() {
		try {
			const countries = [
				{ countryId: 1, name: 'England' },
				{ countryId: 2, name: 'Australia' },
				{ countryId: 3, name: 'New Zealand' },
				{ countryId: 4, name: 'Philippines' },
			];
			this.props.setCountries(countries);
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">Enter your name</h1>
				</header>
				<Container>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/list" exact component={GameList} />
						<Route path="/game/:gameId" exact component={GameLobby} />
					</Switch>
				</Container>
				<VotingDemo />
			</div>
		);
	}
}

export default connect(null, mapDispatchToProps)(App);
export { App as PlainApp };
