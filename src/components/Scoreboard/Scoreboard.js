import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions'
import { Country } from 'components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ScoreboardPin from './ScoreboardPin';
import './Scoreboard.scss';

const mapStateToProps = (state) => ({
  countries: state.countries.countries,
})

class Scoreboard extends PureComponent {
  state = {
    turnNumber: this.props.turnNumber,
    roundNumber: this.props.roundNumber,
  };

  static propTypes = {
    isTouchdown: PropTypes.bool.isRequired,
    isTackled: PropTypes.bool.isRequired,
    turnNumber: PropTypes.number.isRequired,
    roundNumber: PropTypes.number.isRequired,
    gameScore: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };

  getCountry = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country || { name: 'N/A' };
  }

  getTeamScore = (team) => {
    const { gameScore } = this.props;
    const score = gameScore.find(a => a.teamId === team.teamId);
    return score ? score.score : 0;
  }

  render() {
    const {
      teams,
      isTackled,
      isTouchdown,
      turnNumber,
      roundNumber,
    } = this.props;

    return (
      <div className="score-view">
        <div className="score-view__header">
          <div className="score-view__header-country">
            <Country country={this.getCountry(teams[0])} />
            <h3>{this.getTeamScore(teams[0])}</h3>
          </div>
          <p>
            <label>{`Round ${roundNumber}`}</label>
            <label>{`Turn ${turnNumber}`}</label>
          </p>
          <div className="score-view__header-country">
            <Country country={this.getCountry(teams[1])} />
            <h3>{this.getTeamScore(teams[1])}</h3>
          </div>
        </div>
        <div className={`score-view__field default`}>
          <ContainerDimensions>
            {
              ({ width, height }) =>
                <ScoreboardPin
                  width={width}
                  height={height}
                  isTouchdown={isTouchdown}
                  isTackled={isTackled}
                  turnNumber={turnNumber}
                  roundNumber={roundNumber}
                />
            }
          </ContainerDimensions>

        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Scoreboard));