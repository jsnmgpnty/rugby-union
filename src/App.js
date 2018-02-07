import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import { setCountries } from 'actions/countries';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient';
import { Navigator } from 'components';
import { Join, GameCreate, GameLobby, Lobby, GameDetails } from 'view';

import './App.scss';

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
			return <Redirect to="/join" />
		}
	}

	isUserAlreadySignedIn = () => {
		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			onUserCreate(user.username);
			return <Redirect to="/" />
		} else {
			return <Join {...this.props.location} />
		}
	}

	render() {
		return (
			<div className="App">
				<div className="rugby-main">
					<div className="rugby-content">
						<Switch>
							<Route path="/" exact render={() => this.isUserSignedIn(Lobby)} />
							<Route path="/create" exact render={() => this.isUserSignedIn(GameCreate)} />
							<Route path="/join" exact component={() => this.isUserAlreadySignedIn()} />
							<Route path="/game/:gameId" exact render={() => this.isUserSignedIn(GameLobby)} />
							<Route path="/game/:gameId/details" exact render={() => this.isUserSignedIn(GameDetails)} />
						</Switch>
					</div>
					<div className="rugby-nav">
						<Navigator />
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(connect(null, mapDispatchToProps)(App));
export { App as PlainApp };
