import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';

import AppRoutes from './routes';
import { setCountries } from 'actions/countries';
import { setUser } from 'actions/user';
import { initializeSession } from 'services/SocketClient';
import { Navigator, Spinner } from 'components';

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
		user: null,
		activeGame: null,
		hasInitialized: false,
	};

	async componentDidMount() {
		await this.getCountries();

		const user = reactLocalStorage.getObject('user');
		if (user && user.userId && user.username) {
			initializeSession(user);
			this.props.setUser(user);
		}

		this.setState({ hasInitialized: true });
	}

	async getCountries() {
		try {
			const countries = [
				{
					countryId: '7f64422c-2c92-4dce-bc6c-0e865344fe3a',
					name: 'england',
					players: [
						{
							playerId: 'db0b6735-271a-45db-b38e-4d42a862a1ca',
							name: 'JONNY WILKINSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/125/310x255/70193.jpg',
						},
						{
							playerId: '3edae4fe-add2-497b-a902-8e2c200b4a93',
							name: 'OWEN FARRELL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/125/310x255/97969.jpg',
						},
						{
							playerId: 'c6a291a4-2e10-4687-8391-83c41ee7a533',
							name: 'TOBY FLOOD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/125/310x255/8146.jpg',
						},
						{
							playerId: '80b760e7-cf13-4784-aba8-d09070907528',
							name: 'GEORGE FORD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/125/310x255/100572.jpg',
						},
						{
							playerId: '2da85db0-4412-48aa-8577-0a431b0eae70',
							name: 'CHARLIE HODGSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/125/310x255/625.jpg',
						}
					],
				},
				{
					countryId: 'cf82934e-7a6b-49aa-954f-3a911de6db96',
					name: 'france',
					players: [
						{
							playerId: 'cf05dc53-e0df-4aad-a861-29cc69e0ddb9',
							name: 'CAMILLE LOPEZ',
							profilePicture: 'src="https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/129/310x255/103905.jpg"',
						},
						{
							playerId: 'cb12a1e8-b613-42c3-b978-ceed39c4e2ba',
							name: 'MAXIME MACHENAUD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/129/310x255/98110.jpg',
						},
						{
							playerId: '5f6b6866-53f9-4b66-b7cb-706bf1563fc0',
							name: 'AURELIEN ROUGERIE',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/125/310x255/8146.jpg',
						},
						{
							playerId: '94fcdc36-2f24-428b-83f7-761b2e101bea',
							name: 'IMANOL HARINORDOQUY',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/129/310x255/1569.jpg',
						},
						{
							playerId: 'f897f295-416a-450b-a6b2-e34ad485efd2',
							name: 'YANNICK JAUZION',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/129/310x255/734.jpg"',
						}
					],
				},
				{
					countryId: '0be94155-2a92-448d-83b1-13777e84ac0c',
					name: 'ireland',
					players: [
						{
							playerId: '3fbe7a13-459a-41ab-a5f4-0fbf54e523af',
							name: 'BRIAN O\'DRISCOLL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2013/sixnations/126/310x255/440.jpg',
						},
						{
							playerId: '017673b8-aa71-44a8-9c32-02c5dcd1823d',
							name: 'RONAN O\'GARA',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/126/310x255/504.jpg',
						},
						{
							playerId: '45ce2091-b690-4a52-bdd9-7974adfde671',
							name: 'RORY BEST',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/126/310x255/750.jpg',
						},
						{
							playerId: '8d9b48ac-9564-44a9-bd0a-1af58b710717',
							name: 'JOHN HAYES',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/126/310x255/70446.jpg',
						},
						{
							playerId: '8d0006df-f426-4602-b03e-fafea7740a9e',
							name: 'PAUL O\'CONNELL',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/126/310x255/503.jpg',
						}
					],
				},
				{
					countryId: 'd0dc1ee0-8597-4d07-ae14-6096c803c655',
					name: 'italy',
					players: [
						{
							playerId: 'e45da573-9449-4709-a097-0fc7fcf0cb97',
							name: 'SERGIO PARISSE',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/130/310x255/54.jpg',
						},
						{
							playerId: '116fdea3-1893-4897-af15-450189215d8f',
							name: 'MARTIN CASTROGIOVANNI',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/130/310x255/143.jpg',
						},
						{
							playerId: '35bfe4c8-e6da-49ee-97b5-f7baa416557f',
							name: 'MARCO BORTOLAMI',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/130/310x255/1593.jpg',
						},
						{
							playerId: 'b728dec0-cf3d-4b8b-9700-50714d511d62',
							name: 'ANDREA LO CICERO',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2012/sixnations/130/310x255/1894.jpg',
						},
						{
							playerId: '46b8d889-d6a4-4171-82e3-378122f9df24',
							name: 'MIRCO BERGAMASCO',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2013/sixnations/130/310x255/651.jpg',
						}
					],
				},
				{
					countryId: 'a98d6638-cd91-4be1-9c23-43ae83766c83',
					name: 'scotland',
					players: [
						{
							playerId: '71f61b3f-e663-4cdf-a95d-e131baead877',
							name: 'ROSS FORD',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2017/sixnations/127/310x255/688.jpg',
						},
						{
							playerId: 'bf07d28c-ca1a-4fb3-ab84-18429e9a020f',
							name: 'CHRIS PATERSON',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/127/310x255/265.jpg',
						},
						{
							playerId: '9ed51e7c-6cc3-4dd4-90c3-8a9b85287c12',
							name: 'SEAN LAMONT',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/127/310x255/1104.jpg',
						},
						{
							playerId: 'aaff651b-66de-4aa4-9efc-668e2e5f893a',
							name: 'CHRIS CUSITER',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2014/sixnations/127/310x255/683.jpg',
						},
						{
							playerId: '0811ba6e-15a8-4a98-a5c3-067bb2f66b47',
							name: 'MIKE BLAIR',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2011/sixnations/127/310x255/241.jpg',
						}
					],
				},
				{
					countryId: 'aa589354-1c09-4833-9a5a-c77530c0bcc8',
					name: 'wales',
					players: [
						{
							playerId: '3b467892-f0bd-44d1-9c13-e5d906967256',
							name: 'GETHIN JENKINS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2015/sixnations/128/310x255/4398.jpg',
						},
						{
							playerId: '3522d9df-8b71-488a-9639-cbce0aa19f54',
							name: 'STEPHEN JONES',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/128/310x255/70640.jpg',
						},
						{
							playerId: 'ebb6c810-a0de-42a6-9e59-ae1b02b7fd45',
							name: 'MARTYN WILLIAMS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2010/sixnations/128/310x255/70723.jpg',
						},
						{
							playerId: '657c7bba-e7de-46e3-82d9-0e4bc88d6926',
							name: 'JAMIE ROBERTS',
							profilePicture: 'https://cdn.soticservers.net/tools/images/players/photos/2016/sixnations/128/310x255/9375.jpg',
						},
						{
							playerId: 'e49f8cf0-9e5a-4dab-be37-dbe4dfd01b07',
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
								this.state.hasInitialized && <AppRoutes setUser={this.props.setUser} />
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
