import React, { PureComponent } from 'react';
import { Country } from 'components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import uuid from 'uuid';
import './Scoreboard.scss';
import { onGameScoreboard } from '../../services/SocketClient';
import PropTypes from 'prop-types';

const mapStateToProps = (state) => ({
  countries: state.countries.countries,
})

class Scoreboard extends PureComponent {
  static propTypes = {
    game: PropTypes.shape({
      isSaved: PropTypes.bool.isRequired,
      isTackled: PropTypes.bool.isRequired,
      currentTurnNumber: PropTypes.number.isRequired
    }),
    teams: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  };

  getCountry = (team) => {
    const { countries } = this.props;
    const country = countries.find(a => a.countryId === team.countryId);
    return country || { name: 'N/A' };
  }

  getMockedCountry() {
    return {
      countryId: uuid(),
      name: "England",
      players: [],
    };
  };

  getResultField = (game) => {
    if (game.currentTurnNumber === 1) {
      return "default";
    }

    let scoreFieldClassName = game.isSaved ? "safe" : "tackled";
    scoreFieldClassName += game.currentTurnNumber;

    return scoreFieldClassName;
  }

  render() {
    const { teams } = this.props;

    return (
      <div>
        <div className="score-view__header">
          <Country country={this.getCountry(teams[0])} />
          <span className="scoreTally">00:00</span>
          <Country country={this.getCountry(teams[1])} />
        </div>
        <img className={`score-view__field ${this.getResultField(this.props.game)}`} />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Scoreboard));