import React from 'react';
import uuid from 'uuid';
import { Country } from 'components';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

import './SplashScreen.scss';

const propTypes = {
};

const defaultProps = {
};

const SplashScreen = sizeMe({
  monitorHeight: true,
  monitorWidth: true,
})(class Example extends React.PureComponent {
	
	getMockedCountry() {
        return {
            countryId: uuid(),
            name: "England",
            players: [],
        };
    }
	
	static propTypes = {
		size: PropTypes.shape({
		  width: PropTypes.number,
		  height: PropTypes.number,
		  numberOfPieces: PropTypes.number,
		}),
	}
	render() {
		return (
		  <div className="splash-screen">
				<Confetti {...this.props.size} />
				<h2>Scotland Wins the Game!</h2>
                <div className="score-view__header">
					<div className="per-team">
						<Country country={this.getMockedCountry()} />
						<div className="team-score">
							Score 
							<p>2</p>
						</div>
					</div>
					<div className="per-team">
						<Country country={this.getMockedCountry()} />
						<div className="team-score">
							Score 
							<p>2</p>
						</div>
					</div>
                </div>
				<div className="footer-block">
				Back to Game Lobby
				</div>
		  </div>
		)
	}
})

SplashScreen.propTypes = propTypes;
SplashScreen.defaultProps = defaultProps;

export default SplashScreen
