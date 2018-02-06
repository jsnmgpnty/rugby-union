import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import { setCountries } from 'actions/countries';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient'
import { Home, GameList, GameCreate, GameLobby, VotingDemo } from 'view';

import './App.css';

const mapDispatchToProps = dispatch => ({
	setCountries: countries => dispatch(setCountries(countries)),
	setUser: user => dispatch(setUser(user)),
});

class App extends Component {
	static propTypes = {
		setCountries: PropTypes.func.isRequired,
		setUser: PropTypes.func.isRequired,
	};

	state = {
		isConnectedToSocketServer: false,
	};

	constructor(props) {
		super(props);

		onUserCreated((data) => {
			if (!data.error) {
				this.props.setUser(data);
				reactLocalStorage.setObject('user', data);
			}
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

	isUserSignedIn = (RenderableComponent) => {
		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			onUserCreate(user.username);
			return <RenderableComponent {...this.props.location} />
		} else {
			return <Redirect to="/" />
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
						<Route path="/create" exact render={() => this.isUserSignedIn(GameCreate)} />
						<Route path="/list" exact render={() => this.isUserSignedIn(GameList)} />
						<Route path="/game/:gameId" exact render={() => this.isUserSignedIn(GameLobby)} />
						<Route path="/voting" exact render={() => this.isUserSignedIn(VotingDemo)} />
					</Switch>
				</Container>
			</div>
		);
	}
}

export default withRouter(connect(null, mapDispatchToProps)(App));
export { App as PlainApp };
