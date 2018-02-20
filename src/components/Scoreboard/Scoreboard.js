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

  updateTurn = () => {
    let turn = this.state.turnNumber;
    let round = this.state.roundNumber;

    if (round === 4) {
      return;
    }

    if (turn === 6) {
      this.setState({ isTouchdown: true });
      round += 1;
      turn = 1;
    } else {
      this.setState({ isTouchdown: false });
      turn += 1;
    }

    this.setState({
      turnNumber: turn,
      roundNumber: round,
    });
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
      <div>
        <div className="score-view__header">
          <Country country={this.getCountry(teams[0])} />
          <span className="scoreTally">00:00</span>
          <Country country={this.getCountry(teams[1])} />
        </div>
        <div className={`score-view__field default`}>
          <ContainerDimensions>
            {
              ({ width, height }) =>
                <ScoreboardPin
                  width={width}
                  height={height}
                  isTouchdown={this.state.isTouchdown}
                  isTackled={isTackled}
                  turnNumber={this.state.turnNumber}
                  roundNumber={this.state.roundNumber}
                />
            }
          </ContainerDimensions>

        </div>
        <a onClick={this.updateTurn}>CLICK</a> 
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Scoreboard));