import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import { setCountries } from 'actions/countries';
import { setUser } from 'actions/user';
import { onUserCreate, onUserCreated } from 'services/SocketClient';
import gameApi from 'services/GameApi';
import { Navigator, Spinner } from 'components';
import { Join, GameCreate, GamePrepare, Lobby, GameDetails } from 'view';

import './App.scss';

const mapDispatchToProps = dispatch => ({
	setCountries: countries => dispatch(setCountries(countries)),
	setUser: user => dispatch(setUser(user)),
});

const mapStateToProps = state => ({
	isPageLoading: state.navigation.isPageLoading,
});

class App extends Component {
	static propTypes = {
		setCountries: PropTypes.func.isRequired,
		setUser: PropTypes.func.isRequired,
	};

	state = {
		isConnectedToSocketServer: false,
		user: null,
		activeGame: null,
		isBusy: false,
		hasInitialized: false,
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

		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			this.props.setUser(user);
		}

		this.setState({ hasInitialized: true });
	}

	async getCountries() {
		try {
			const countries = [
				{
					countryId: 1,
					name: 'england',
					players: [
						{
							playerId: 1,
							name: 'JONNY WILKINSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/125/310x255/70193.jpg',
						},
						{
							playerId: 2,
							name: 'OWEN FARRELL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/125/310x255/97969.jpg',
						},
						{
							playerId: 3,
							name: 'TOBY FLOOD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/125/310x255/8146.jpg',
						},
						{
							playerId: 4,
							name: 'GEORGE FORD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/125/310x255/100572.jpg',
						},
						{
							playerId: 5,
							name: 'CHARLIE HODGSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/125/310x255/625.jpg',
						}
					],
				},
				{
					countryId: 2,
					name: 'france',
					players: [
						{
							playerId: 6,
							name: 'CAMILLE LOPEZ',
							profilePicture: 'src="https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/129/310x255/103905.jpg"',
						},
						{
							playerId: 7,
							name: 'MAXIME MACHENAUD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/129/310x255/98110.jpg',
						},
						{
							playerId: 8,
							name: 'AURELIEN ROUGERIE',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/125/310x255/8146.jpg',
						},
						{
							playerId: 9,
							name: 'IMANOL HARINORDOQUY',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/129/310x255/1569.jpg',
						},
						{
							playerId: 10,
							name: 'YANNICK JAUZION',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/129/310x255/734.jpg"',
						}
					],
				},
				{
					countryId: 3,
					name: 'ireland',
					players: [
						{
							playerId: 11,
							name: 'BRIAN O\'DRISCOLL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2013/sixnations/126/310x255/440.jpg',
						},
						{
							playerId: 12,
							name: 'RONAN O\'GARA',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/126/310x255/504.jpg',
						},
						{
							playerId: 13,
							name: 'RORY BEST',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/126/310x255/750.jpg',
						},
						{
							playerId: 14,
							name: 'JOHN HAYES',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/126/310x255/70446.jpg',
						},
						{
							playerId: 15,
							name: 'PAUL O\'CONNELL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/126/310x255/503.jpg',
						}
					],
				},
				{
					countryId: 4,
					name: 'italy',
					players: [
						{
							playerId: 16,
							name: 'SERGIO PARISSE',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/130/310x255/54.jpg',
						},
						{
							playerId: 17,
							name: 'MARTIN CASTROGIOVANNI',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/130/310x255/143.jpg',
						},
						{
							playerId: 18,
							name: 'MARCO BORTOLAMI',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/130/310x255/1593.jpg',
						},
						{
							playerId: 19,
							name: 'ANDREA LO CICERO',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/130/310x255/1894.jpg',
						},
						{
							playerId: 20,
							name: 'MIRCO BERGAMASCO',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2013/sixnations/130/310x255/651.jpg',
						}
					],
				},
				{
					countryId: 5,
					name: 'scotland',
					players: [
						{
							playerId: 21,
							name: 'ROSS FORD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/127/310x255/688.jpg',
						},
						{
							playerId: 22,
							name: 'CHRIS PATERSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/127/310x255/265.jpg',
						},
						{
							playerId: 23,
							name: 'SEAN LAMONT',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/127/310x255/1104.jpg',
						},
						{
							playerId: 24,
							name: 'CHRIS CUSITER',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/127/310x255/683.jpg',
						},
						{
							playerId: 25,
							name: 'MIKE BLAIR',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/127/310x255/241.jpg',
						}
					],
				},
				{
					countryId: 6,
					name: 'wales',
					players: [
						{
							playerId: 26,
							name: 'GETHIN JENKINS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/128/310x255/4398.jpg',
						},
						{
							playerId: 27,
							name: 'STEPHEN JONES',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/128/310x255/70640.jpg',
						},
						{
							playerId: 28,
							name: 'MARTYN WILLIAMS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/128/310x255/70723.jpg',
						},
						{
							playerId: 29,
							name: 'JAMIE ROBERTS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2016/sixnations/128/310x255/9375.jpg',
						},
						{
							playerId: 30,
							name: 'ALUN WYN JONES',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/128/310x255/5071.jpg',
						}
					],
				},
			];
			this.props.setCountries(countries);
		} catch (error) {
			console.log(error);
		}
	}

	isUserSignedIn(RenderableComponent) {
		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			this.props.setUser(user);
			return <RenderableComponent {...this.props.location} />;
		} else {
			return <Redirect to="/join" />;
		}
	}

	isUserAlreadySignedIn() {
		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			this.props.setUser(user);
			return <Redirect to="/" />
		} else {
			return <Join {...this.props.location} />
		}
	}

	render() {
		const {
			isPageLoading,
		} = this.props;

		return (
			<div className="App">
				<div className="rugby-main">
					<div className="rugby-content">
						<Spinner isLoading={isPageLoading}>
							{
								this.state.hasInitialized &&
								<Switch>
									<Route path="/" exact render={() => this.isUserSignedIn(Lobby)} />
									<Route path="/create" exact render={() => this.isUserSignedIn(GameCreate)} />
									<Route path="/join" exact component={() => this.isUserAlreadySignedIn()} />
									<Route path="/game/:gameId" exact render={() => this.isUserSignedIn(GamePrepare)} />
									<Route path="/game/:gameId/details" exact render={() => this.isUserSignedIn(GameDetails)} />
								</Switch>
							}
						</Spinner>
					</div>
					<div className="rugby-nav">
						<Navigator />
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export { App as PlainApp };
