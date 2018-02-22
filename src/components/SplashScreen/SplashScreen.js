import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

import { Country } from 'components';
import './SplashScreen.scss';

const propTypes = {
	teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
	currentTeam: PropTypes.string.isRequired,
	winningTeam: PropTypes.string.isRequired,
	gameScore: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

const SplashScreen = sizeMe({
	monitorHeight: true,
	monitorWidth: true,
})(class Example extends React.PureComponent {
	static propTypes = {
		size: PropTypes.shape({
			width: PropTypes.number,
			height: PropTypes.number,
			numberOfPieces: PropTypes.number,
		}),
	};

	state = {
		goToLobby: false,
	};

	isUserWon = () => {
		const { winningTeam, currentTeam } = this.props;
		return winningTeam === currentTeam;
	};

	getWinningTeamTeamCountry = () => {
		const { teams, winningTeam } = this.props;
		const team = teams.find(a => a.teamId === winningTeam);

		if (team) {
			return team.country ? team.country.name : 'N/A';
		}

		return 'N/A';
	};

	getTeamScore = (team) => {
		const gameScore = this.props.gameScore.find(a => a.teamId === team.teamId);
		return gameScore ? gameScore.score : 0;
	};

	onBackButton = () => {
		this.setState({ goToLobby: true });
	}

	render() {
		const { teams } = this.props;

		return (
			<div className="splash-screen">
				<div className={`splash-screen__overlay ${!this.isUserWon() ? 'lost' : ''}`}></div>
				<div className="splash-screen__contents">
					{
						this.isUserWon() && <Confetti {...this.props.size} />
					}
					<h2>
						<span>{this.getWinningTeamTeamCountry()}</span> won the Game!
					</h2>
					<div className="score-view__header">
						{
							teams.map(team => (
								<div className="per-team" key={team.teamId}>
									<Country country={team.country} />
									<div className="team-score">
										Score
									<p>{this.getTeamScore(team)}</p>
									</div>
								</div>
							))
						}
					</div>
					<a className="footer-block" onClick={this.onBackButton}>
						Back to Game Lobby
					</a>
					{
						this.state.goToLobby && <Redirect to="/" />
					}
				</div>
			</div>
		)
	}
})

SplashScreen.propTypes = propTypes;

export default SplashScreen;
